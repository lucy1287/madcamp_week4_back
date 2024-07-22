const { DataTypes } = require('sequelize');
const sequelize = require("../config/database");
const GROUP = require('./group');
const USER = require('./user');

const GUEST = sequelize.define('GUEST', {
    // GUEST 모델의 속성들을 정의
    guest_no: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false
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
    }
    // 추가적인 속성들을 필요에 따라 정의 가능
}, {
    tableName: 'GUEST',
    timestamps: false
});

module.exports = GUEST;