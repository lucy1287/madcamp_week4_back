const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const USER = sequelize.define('USER', {
    user_no: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    kakao_id: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    nickname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true
    },
    photo: {
        type: DataTypes.STRING,
        allowNull: true
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'USER',
    timestamps: false
});

module.exports = USER;