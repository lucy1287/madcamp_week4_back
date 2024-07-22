const { DataTypes } = require('sequelize');
const sequelize = require("../config/database");
const USER = require("./user");
const PAPER = require("./paper");

const LETTER = sequelize.define('LETTER', {
    // LETTER 모델의 속성들을 정의
    letter_no: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    content: {
        type: DataTypes.STRING,
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    user_no: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: USER,
            key: 'user_no'
        }
    },
    paper_no: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: PAPER,
            key: 'paper_no'
        }
    }
    // 추가적인 속성들을 필요에 따라 정의 가능
}, {
    tableName: 'LETTER',
    timestamps: false
});

module.exports = LETTER;