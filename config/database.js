const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('madcamp_week4', 'admin', 'admin1234', {
    host: 'madcamp-week4-mysql.cp4ko6qc8hj3.us-east-1.rds.amazonaws.com',
    dialect: 'mysql',
    port: 3306,
    define: {
        timestamps: true
    }
});

module.exports = sequelize;