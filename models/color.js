const { DataTypes } = require('sequelize');
const sequelize = require("../config/database");

const COLOR = sequelize.define('COLOR', {
    // COLOR 모델의 속성들을 정의
    color_no: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    color_hex_code: {
        type: DataTypes.STRING,
        allowNull: false
    }
    // 추가적인 속성들을 필요에 따라 정의 가능
}, {
    tableName: 'COLOR',
    timestamps: false
});

module.exports = COLOR;