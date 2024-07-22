// routes/letter.js
const express = require('express');
const router = express.Router();
const { getLettersByPaperNo } = require('../controllers/letter');
const { insertLetter } = require('../controllers/letter');

router.get('/', getLettersByPaperNo)

// 새로운 글 생성 라우트
router.post('/create/:user_no', (req, res) => {
    const user_no = req.params.user_no;
    insertLetter(req, user_no, res);
});

module.exports = router;