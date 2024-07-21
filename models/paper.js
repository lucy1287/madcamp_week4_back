const { DataTypes } = require('sequelize');
const sequelize = require("../config/database");
const USER = require("./user");
const GROUP = require("./group");
const GUEST = require("./guest");

const PAPER = sequelize.define('PAPER', {
    // PAPER 모델의 속성들을 정의
    paper_no: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    user_no: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: USER,
            key: 'user_no'
        }
    },
    group_no: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: GROUP,
            key: 'group_no'
        }
    },
    guest_no: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: GUEST, // 참조할 모델 (GROUP 모델)
            key: 'guest_no'   // 참조할 속성 (User 모델의 기본 키)
        }
    }
    // 추가적인 속성들을 필요에 따라 정의 가능
}, {
    tableName: 'GROUP',
    timestamps: false
});

module.exports = PAPER;