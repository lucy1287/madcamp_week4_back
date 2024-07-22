const express = require('express')
const app = express()
const http = require('http')
const cors = require('cors');
const sequelize = require('./config/database');
const port = 5000

// CORS 설정 추가
app.use(cors({
    origin: 'http://localhost:3000', // 허용할 출처
    methods: 'GET,POST', // 허용할 HTTP 메서드
    credentials: true, // 쿠키를 포함한 요청을 허용
}));

// 기타 라우트 및 미들웨어 설정
app.use(express.json());


// sequelize
sequelize.authenticate()
    .then(() => {
        console.log('MySQL 데이터베이스 연결 성공!');
        return sequelize.sync();
    })
    .then(() => {
        console.log('모델 동기화 완료!');
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err);
    });

// Sequelize.sync()를 호출하여 모든 모델과 데이터베이스를 동기화
sequelize.sync()
    .then(() => {
        console.log('Database & tables created!');
        // 이후 서버 시작 등의 작업을 여기서 수행

        // 라우터 생성
        //const homeRouter = require('./routes/home');
        const userRouter = require('./routes/user');
        const groupRouter = require('./routes/group');
        const paperRouter = require('./routes/paper');

        app.get('/', (req, res) => {
            res.send('hello node');
        });

        // 라우터 연결
        //app.use('/home', homeRouter);
        app.use('/user', userRouter);
        app.use('/group', groupRouter);
        app.use('/paper', paperRouter);

        app.listen(port, function() {
            console.log(`listening on *:${port}`);
        });
    })
    .catch((err) => {
        console.error('Unable to sync database:', err);
    });