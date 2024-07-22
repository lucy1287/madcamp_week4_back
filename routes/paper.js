// routes/paper.js
const express = require('express');
const router = express.Router();
const { getPapersByGroupNo } = require('../controllers/paper');

// 그룹의 롤링페이퍼 조회
router.get('/', getPapersByGroupNo);

module.exports = router;