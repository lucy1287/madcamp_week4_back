// routes/group.js
const express = require('express');
const router = express.Router();
const { insertGroupAndUserGroup } = require('../controllers/group');
const { insertUserGroupAndPaper } = require('../controllers/group');

// 새로운 그룹 생성 라우트
router.post('/create/:user_no', (req, res) => {
    const user_no = req.params.user_no;
    insertGroupAndUserGroup(req, user_no, res);
});


// 새로운 유저그룹 생성 라우트
router.post('/join/:user_no', (req, res) => {
    const user_no = req.params.user_no;
    insertUserGroupAndPaper(req, user_no, res);
})

module.exports = router;