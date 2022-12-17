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
    },
    modified: {
        type: DataTypes.DATE,
        allowNull: false,
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
        allowNull: false,
    },
    destination_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: Destination,
            key: "id"
        }
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
        }
    },
    days: {
        type: DataTypes.SMALLINT,
        allowNull: true,
    },
    _order: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
},
{
    timestamps: false,
    tableName: 'tours_tourfeature',
    freezeTableName: true
})

module.exports = TourFeature;