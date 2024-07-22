const { DataTypes } = require('sequelize');
const sequelize = require("../config/database");

const BACKGROUND = sequelize.define('BACKGROUND', {
    // BACKGROUND 모델의 속성들을 정의
    background_no: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    background_url: {
        type: DataTypes.STRING,
        allowNull: false
    }
    // 추가적인 속성들을 필요에 따라 정의 가능
}, {
    tableName: 'BACKGROUND',
    timestamps: false
});

module.exports = BACKGROUND;