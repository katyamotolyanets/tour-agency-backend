const {DataTypes} = require('sequelize');
const db = require('../../db-connection')
const Country = require("./Country");
const Image = require("../images/Image");

const Destination = db.define('destination', {
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
        name: {
            type: DataTypes.STRING(256),
            allowNull: false,
            unique: true
        },
        location: {
            type: DataTypes.GEOGRAPHY,
            allowNull: true,
            defaultValue: null
        },
        country_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            unique: true,
            references: {
                model: Country,
                key: "id"
            }
        },
        description: {
            type: DataTypes.STRING(512),
            allowNull: true,
        },
        image_id: {
            type: DataTypes.BIGINT,
            allowNull: true,
            unique: true,
            references: {
                model: Image,
                key: "id"
            },
            defaultValue: null
        }
    },
    {
        timestamps: false,
        tableName: 'locations_destination',
        freezeTableName: true
    })

module.exports = Destination;