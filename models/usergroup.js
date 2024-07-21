const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const USER = require("./user");
const GROUP = require("./group");

const USER_GROUP = sequelize.define('USER_GROUP', {
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
        allowNull: true,
        references: {
            model: GROUP,
            key: 'group_no'   
        }
    }
}, {
    tableName: 'USER_GROUP',
    timestamps: false
});

module.exports = USER_GROUP;