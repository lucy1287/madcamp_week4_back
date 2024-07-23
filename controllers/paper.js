const { USER, GROUP, PAPER, LETTER } = require('../models/associations');

exports.getPapersByGroupNo = async function(req, res) {
    try {
        const { group_no } = req.query;

        if (!group_no) {
            return res.status(400).json({ message: '그룹 번호를 제공해야 합니다.' });
        }

        const papers = await PAPER.findAll({
            where: { group_no: group_no },
            order: [['title', 'ASC']]
        });

        if (papers.length === 0) {
            return res.status(404).json({ message: '해당 그룹의 롤링페이퍼를 찾을 수 없습니다.' });
        }

        res.status(200).json(papers);

    } catch (err) {
        console.error('Error retrieving papers:', err);
        res.status(500).json({ message: '롤링페이퍼 조회 중 오류가 발생했습니다.', error: err.message });
    }
};

// PAPER_NO를 통해 LETTER 테이블에서 글을 쓴 사용자 정보를 조회하는 함수
exports.getLettersWithUserInfo = async function(req, res) {
    const { paper_no } = req.query;

    try {
        if (!paper_no) {
            return res.status(400).json({ message: 'PAPER 번호를 제공해야 합니다.' });
        }

        // PAPER_NO로 LETTER 테이블에서 해당 PAPER의 모든 LETTER 조회
        const letters = await LETTER.findAll({
            where: { paper_no: paper_no },
            order: [['created_at', 'ASC']],
            attributes: ['letter_no', 'content', 'created_at', 'user_no'],
            include: [{
                model: USER,
                as: 'letterUser',
                attributes: ['user_no', 'nickname', 'photo']
            }]
        });

        if (letters.length === 0) {
            return res.status(404).json({ message: '해당 PAPER의 LETTER을 찾을 수 없습니다.' });
        }

        // 결과를 가공하여 USER 정보와 함께 반환
        const lettersWithUserInfo = letters.map(letter => {
            return {
                letter_no: letter.letter_no,
                content: letter.content,
                created_at: letter.created_at,
                user: {
                    nickname: letter.letterUser.nickname,
                    photo: letter.letterUser.photo
                }
            };
        });

        res.status(200).json({lettersWithUserInfo});

    } catch (err) {
        console.error('Error retrieving letters:', err);
        res.status(500).json({ message: '글 조회 중 오류가 발생했습니다.', error: err.message });
    }
};