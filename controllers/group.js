const sequelize = require('../config/database');
const { USER, GROUP, USER_GROUP, PAPER, LETTER} = require('../models/associations');

// 유저 번호를 받아서 해당 유저가 속한 그룹들을 조회하는 함수
exports.getGroupsByUserNo = async function(req, user_no, res) {

    try {
        const userGroups = await USER_GROUP.findAll({
            where: { user_no: user_no },
            include: [{
                model: GROUP,
                as: 'group',
                attributes: [
                    'group_no',
                    'title',
                    'due_date',
                    'cardinality_yn',
                    'invite_code',
                ]
            }]
        });

        // 각 USER_GROUP 인스턴스에서 GROUP 객체를 추출
        const groups = userGroups.map(userGroup => userGroup.group);

        res.status(200).json(groups);
    } catch (err) {
        console.error(err); // 에러를 콘솔에 출력하여 원인 확인
        res.status(500).json({ message: '그룹 조회 중 오류가 발생했습니다.', error: err.message });
    }
};

// 그룹 생성자가 그룹 추가하는 함수
exports.insertGroupAndUserGroup = async function(req, user_no, res) {
    const t = await sequelize.transaction(); // 트랜잭션 시작
    try {
        const { title, cardinality_yn } = req.body;

        // 그룹 생성
        let group = await GROUP.create({
            title: title,
            cardinality_yn: cardinality_yn
        }, { transaction: t });
        // 그룹 생성 후 자동 생성된 group_no 가져오기
        let groupNo = group.group_no;
        // group_no를 사용하여 초대 코드 생성
        const inviteCode = generateInviteCode(groupNo);
        // 생성된 초대 코드를 그룹에 업데이트
        await GROUP.update(
            { invite_code: inviteCode },
            { where: { group_no: groupNo }, transaction: t }
        );


        // USER_GROUP 테이블에 그룹 생성자 정보 추가
        await USER_GROUP.create({
            group_no: groupNo,
            user_no: user_no,
            creater_yn: 'Y'
        }, { transaction: t });


        if(cardinality_yn == "Y") {
            // User 테이블에서 user_no로 nickname을 조회
            let user = await USER.findOne({where: {user_no: user_no}, transaction: t});
            if (!user) {
                return res.status(404).json({message: '유저를 찾을 수 없습니다.'});
            }
            // PAPER 테이블에 데이터 삽입
            await PAPER.create({
                title: `${user.nickname}의 롤링페이퍼`,
                group_no: groupNo,
                user_no: user_no
            }, {transaction: t});
        }
        else if(cardinality_yn == "N"){
            await PAPER.create({
                title: `롤링페이퍼`,
                group_no: groupNo
            }, {transaction: t});
        }

        await t.commit(); // 트랜잭션 커밋

        res.status(201).json({ message: '그룹이 성공적으로 추가되었습니다.' });

    } catch (err) {
        await t.rollback(); // 오류 발생 시 트랜잭션 롤백
        res.status(500).json({ message: '그룹 추가 중 오류가 발생했습니다.', error: err.message });
    }
};

// 로그인하고 초대코드 입력한 유저를 그룹에 INSERT 하는 함수
exports.insertUserGroupAndPaper = async function(req, user_no, res) {
    const t = await sequelize.transaction(); // 트랜잭션 시작
    try {
        const { invite_code } = req.body;

        // 초대 코드로 그룹 번호 조회
        const group = await GROUP.findOne({
            where: { invite_code: invite_code },
            transaction: t
        });
        if (!group) {
            return res.status(404).json({ message: '유효하지 않은 초대 코드입니다.' });
        }
        const groupNo = group.group_no;
        const cardinalityYn = group.cardinality_yn;

        if(cardinalityYn == "Y"){
            // USER_GROUP 테이블에 데이터 삽입
            await USER_GROUP.create({
                creater_yn: "N",
                group_no: groupNo,
                user_no: user_no
            }, { transaction: t });


            // User 테이블에서 user_no로 nickname을 조회
            let user = await USER.findOne({ where: { user_no: user_no }, transaction: t });
            if (!user) {
                return res.status(404).json({ message: '유저를 찾을 수 없습니다.' });
            }
            // PAPER 테이블에 데이터 삽입
            await PAPER.create({
                title: `${user.nickname}의 롤링페이퍼`,
                group_no: groupNo,
                user_no: user_no
            }, { transaction: t });

            await t.commit(); // 트랜잭션 커밋

            res.status(201).json({ message: '유저그룹과 롤링페이퍼가 성공적으로 추가되었습니다.' });
        }
        else if(cardinalityYn == "N") {

            // 해당 그룹에 속하는 PAPER를 조회
            const paper = await PAPER.findOne({
                where: { group_no: groupNo },
                transaction: t
            });

            if (!paper) {
                await t.commit(); // 트랜잭션 커밋
                return res.status(404).json({ message: '해당 그룹의 롤링페이퍼를 찾을 수 없습니다.' });
            }

            // PAPER와 LETTER를 조인하여 LETTER 조회
            const letters = await LETTER.findAll({
                where: { paper_no: paper.paper_no },
                order: [['created_at', 'ASC']],
                transaction: t
            });

            if (letters.length === 0) {
                await t.commit(); // 트랜잭션 커밋
                return res.status(404).json({ message: '해당 롤링페이퍼의 글을 찾을 수 없습니다.' });
            }

            await t.commit(); // 트랜잭션 커밋
            res.status(200).json({
                paper: {
                    title: paper.title,
                    letters: letters
                }
            });
        }

    } catch (err) {
        await t.rollback(); // 오류 발생 시 트랜잭션 롤백

        console.error('트랜잭션 오류:', err);

        // 자세한 에러 정보 응답에 추가
        res.status(500).json({
            message: '유저그룹 추가 중 오류가 발생했습니다.',
            error: {
                message: err.message,
                name: err.name,
                stack: err.stack,
                errors: err.errors
            }
        });
    }
};

const generateInviteCode = (groupNo) => {
    // 그룹 번호와 랜덤 문자열을 결합하여 초대 코드 생성
    return `${groupNo}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
};