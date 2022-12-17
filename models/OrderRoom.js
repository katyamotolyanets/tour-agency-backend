const { DataTypes } = require('sequelize');
const db = require('../db-connection')
const RoomType = require("./RoomType");
const Order = require("./Order");
const TourFeature = require("./TourFeature");
const User = require("./User");

const OrderRoom = db.define('orderRoom', {
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
    order_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: Order,
            key: "id"
        }
    },
    end: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    feature_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: TourFeature,
            key: "id"
        }
    },
    room_id : {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: RoomType,
            key: "id"
        }
    },
    start: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    user_id : {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: User,
            key: "id"
        }
    },
},
{
    timestamps: false,
    tableName: 'orders_orderroom',
    freezeTableName: true
})

module.exports = OrderRoom;