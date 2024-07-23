// routes/paper.js
const express = require('express');
const router = express.Router();
const { getPapersByGroupNo } = require('../controllers/paper');
const { getLettersWithUserInfo } = require('../controllers/paper');

// 그룹의 롤링페이퍼 조회
router.get('/', getPapersByGroupNo);

router.get('/userInfo', getLettersWithUserInfo);

module.exports = router;