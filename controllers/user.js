const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const User = require('../models/user');
const app = express();

app.use(bodyParser.json());

const JWT_SECRET = "2d8a5e0c-98d9-4b3e-8cbb-2f5b71a4d7b8";
let kakaoId = "";
let userNo;

exports.loginUser = async function(req, res) {
    // const { access_token } = req.body;
    // console.log("access_token:" + access_token);
    //
    // try {
    //     // 액세스 토큰으로 사용자 정보 요청
    //     const userResponse = await axios.get('https://kapi.kakao.com/v2/user/me', {
    //         headers: {
    //             Authorization: `Bearer ${access_token}`,
    //         },
    //     });
    //
    //     userInfo = userResponse.data;
    //     kakaoId = userInfo.id; // 카카오 계정의 고유 ID
    //
    // }  catch (error) {
    //     console.error('Error during Kakao authentication:', error);
    //     res.status(500).send('Authentication failed');
    // }

    try {
        const { kakao_id, nickname, photo } = req.body;

        // 사용자 정보 검증 및 DB 저장 로직 (DB 연결 필요)
        let user = await User.findOne({ kakaoId });
        if (!user) {
            // 신규 사용자 등록
            user = await User.create({
                kakao_id,
                nickname,
                photo
            });
            userNo = user.user_no;
        } else {
            // 사용자 정보 업데이트
           // await User.updateOne({ kakaoId }, { ...userInfo });
            userNo = user.user_no;
        }

        // JWT 토큰 생성
        const token = jwt.sign({ kakaoId }, JWT_SECRET, { expiresIn: '1h' });

        // 클라이언트에 JWT 토큰과 사용자 정보 반환
        res.status(201).json({
            user_no: userNo,
            token: token
        });

    } catch (error) {
        console.error('Error during DB user insert:', error);
        res.status(500).send('DB user insert failed');
    }
}
