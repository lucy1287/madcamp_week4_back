const { DataTypes } = require('sequelize');
const sequelize = require("../config/database");

const GROUP = sequelize.define('GROUP', {
    // GROUP 모델의 속성들을 정의
    group_no: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    due_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    cardinality_yn: {
        type: DataTypes.STRING,
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    invite_code: {
        type: DataTypes.STRING,
        allowNull: true
    }
    // 추가적인 속성들을 필요에 따라 정의 가능
}, {
    tableName: 'GROUP',
    timestamps: false
});

module.exports = GROUP;