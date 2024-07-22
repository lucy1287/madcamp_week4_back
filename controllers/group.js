const sequelize = require('../config/database');
const { USER, GROUP, USER_GROUP, PAPER} = require('../models/associations');

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

        // USER_GROUP 테이블에 그룹 생성자 정보 추가
        await USER_GROUP.create({
            group_no: groupNo,
            user_no: user_no,
            creater_yn: 'Y'
        }, { transaction: t });

        await t.commit(); // 트랜잭션 커밋

        res.status(201).json({ message: '그룹이 성공적으로 추가되었습니다.' });

    } catch (err) {
        await t.rollback(); // 오류 발생 시 트랜잭션 롤백
        res.status(500).json({ message: '그룹 추가 중 오류가 발생했습니다.', error: err.message });
    }
};
