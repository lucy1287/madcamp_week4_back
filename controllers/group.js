const sequelize = require('../config/database');
const { USER, GROUP, USER_GROUP, PAPER } = require('../models/associations');

// 그룹 생성자가 그룹 추가하는 함수
exports.insertGroupAndUserGroup = async function(req, user_no, res) {
    const t = await sequelize.transaction(); // 트랜잭션 시작
    try {
        const { title } = req.body;

        // 그룹 생성
        let group = await GROUP.create({
            title: title,
            cardinality_yn: 'Y'
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