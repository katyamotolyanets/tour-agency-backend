const {DataTypes} = require('sequelize');
const db = require('../../db-connection')
const Continent = require("./Continent");

const Country = db.define('country', {
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
        description: {
            type: DataTypes.STRING(512),
            allowNull: true,
        },
        continent_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: Continent,
                key: "id"
            }
        }
    },
    {
        timestamps: false,
        tableName: 'locations_country',
        freezeTableName: true
    })

module.exports = Country;