const { DataTypes } = require('sequelize');
const db = require('../db-connection')
const City = require("./locations/City");

const Hotel = db.define('hotel', {
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
    street: {
        type: DataTypes.STRING(256),
        allowNull: false,
        unique: true
    },
    name: {
        type: DataTypes.STRING(256),
        allowNull: false,
        unique: true
    },
    stars_number: {
        type: DataTypes.SMALLINT,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING(1024),
        allowNull: true,
    },
    city_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        unique: true,
        references: {
            model: City,
            key: "id"
        }
    },
},
{
    timestamps: false,
    tableName: 'hotels_hotel',
    freezeTableName: true
})

module.exports = Hotel;