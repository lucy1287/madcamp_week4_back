const { USER, PAPER, GROUP } = require('../models/associations');

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