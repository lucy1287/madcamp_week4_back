const sequelize = require('../config/database');
const { USER, PAPER, LETTER, BACKGROUND, COLOR } = require('../models/associations');

exports.getLettersByPaperNo = async function(req, res) {
    try {
        const {paper_no} = req.query;

        if (!paper_no) {
            return res.status(400).json({message: '그룹 번호를 제공해야 합니다.'});
        }

        const letters = await LETTER.findAll({
            where: { paper_no: paper_no },
            include: [
                {
                    model: USER,
                    as: 'letterUser',
                    attributes: ['nickname']
                },
                {
                    model: BACKGROUND,
                    as: 'letterBackground',
                    attributes: ['background_url']
                },
                {
                    model: COLOR,
                    as: 'letterColor',
                    attributes: ['color_hex_code']
                }
            ],
            order: [['created_at', 'ASC']]
        });

        if (letters.length === 0) {
            return res.status(404).json({message: '해당 롤링페이퍼의 글을 찾을 수 없습니다.'});
        }

        res.status(200).json(letters);

    } catch (err) {
        console.error('Error retrieving papers:', err);
        res.status(500).json({message: '롤링페이퍼 글 조회 중 오류가 발생했습니다.', error: err.message});
    }
}

// 롤링페이퍼에 글 작성하는 함수
exports.insertLetter = async function(req, user_no, res) {
    const t = await sequelize.transaction(); // 트랜잭션 시작
    try {
        const { paper_no, content, background_no, color_no, font_no } = req.body;

        // 롤링페이퍼가 존재하는지 확인
        const paper = await PAPER.findOne({
            where: { paper_no: paper_no },
            transaction: t
        });

        if (!paper) {
            return res.status(404).json({ message: '롤링페이퍼를 찾을 수 없습니다.' });
        }

        // LETTER 테이블에 글 삽입
        const letter = await LETTER.create({
            paper_no: paper_no,
            content: content,
            background_no: background_no,
            color_no: color_no,
            font_no: font_no,
            user_no: user_no
        }, { transaction: t });

        await t.commit(); // 트랜잭션 커밋

        res.status(201).json({ message: '글이 성공적으로 작성되었습니다.', letter: letter });
    } catch (err) {
        await t.rollback(); // 오류 발생 시 트랜잭션 롤백
        console.error(err); // 에러를 콘솔에 출력하여 원인 확인
        res.status(500).json({ message: '글 작성 중 오류가 발생했습니다.', error: err.message });
    }
};