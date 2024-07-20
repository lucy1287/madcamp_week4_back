// routes/user.js
const express = require('express');
const router = express.Router();
const { loginUser } = require('../controllers/user');

// 새로운 사용자 생성 라우트
router.post('/login', loginUser);

module.exports = router;