const { DataTypes } = require('sequelize');
const db = require('../db-connection')
const Destination = require("./locations/Destination");
const Hotel = require("./Hotel");
const Tour = require("./Tour");

const TourFeature = db.define('feature', {
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
    title: {
        type: DataTypes.STRING(256),
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.STRING(1024),
        allowNull: true,
    },
    food: {
        type: DataTypes.ENUM(10),
        allowNull: true,
    },
    destination_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: Destination,
            key: "id"
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
    },
    hotel_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
            model: Hotel,
            key: "id"
        }
    },
    tour_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
            model: Tour,
            key: "id"
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
    },
    days: {
        type: DataTypes.SMALLINT,
        allowNull: true,
    },
    _order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
},
{
    timestamps: false,
    tableName: 'tours_tourfeature',
    freezeTableName: true
})

module.exports = TourFeature;