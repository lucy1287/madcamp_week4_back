const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const USER = require("./user");
const GROUP = require("./group");

const USER_GROUP = sequelize.define('USER_GROUP', {
    user_no: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
            model: USER,
            key: 'USER_NO'
        }
    },
    group_no: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
            model: GROUP,
            key: 'GROUP_NO'
        }
    },
    creater_yn: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    tableName: 'USER_GROUP',
    timestamps: false
});

module.exports = USER_GROUP;