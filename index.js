const express = require('express')
const app = express()
const http = require('http')
const sequelize = require('./config/database');
const port = 5000

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

        app.get('/', (req, res) => {
            res.send('hello node');
        });

        // 라우터 연결
        //app.use('/home', homeRouter);

        app.listen(port, function() {
            console.log(`listening on *:${port}`);
        });
    })
    .catch((err) => {
        console.error('Unable to sync database:', err);
    });