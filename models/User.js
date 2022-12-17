const { DataTypes } = require('sequelize');
const db = require('../db-connection')

const User = db.define('user', {
    id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    created: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    modified: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    password: {
        type: DataTypes.STRING(128),
        allowNull: false,
    },
    last_login: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING(256),
        allowNull: false,
        unique: true
    },
    is_staff: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
    },
    is_manager: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
    },
},
{
    timestamps: false,
    tableName: 'users_user',
    freezeTableName: true
})

module.exports = User;