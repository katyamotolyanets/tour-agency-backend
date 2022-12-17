const { DataTypes } = require('sequelize');
const db = require('../db-connection')
const Hotel = require("./Hotel");

const RoomType = db.define('room_type', {
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
        type: DataTypes.STRING(32),
        allowNull: false,
        unique: true
    },
    count_places: {
        type: DataTypes.SMALLINT,
        allowNull: false,
    },
    is_family: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    cost_per_day: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING(512),
        allowNull: true,
    },
    square: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    hotel_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        unique: true,
        references: {
            model: Hotel,
            key: "id"
        }
    },
    count_rooms: {
        type: DataTypes.SMALLINT,
        allowNull: false,
    },
},
{
    timestamps: false,
    tableName: 'hotels_roomtype',
    freezeTableName: true
})

module.exports = RoomType;