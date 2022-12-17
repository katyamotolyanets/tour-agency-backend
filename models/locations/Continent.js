const {DataTypes} = require('sequelize');
const db = require('../../db-connection')

const Continent = db.define('continent', {
        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        created: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        modified: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(256),
            allowNull: false,
            unique: true
        },
    },
    {
        timestamps: false,
        tableName: 'locations_continent',
        freezeTableName: true
    })

module.exports = Continent;