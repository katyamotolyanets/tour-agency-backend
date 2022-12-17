const { DataTypes } = require('sequelize');
const db = require('../db-connection')
const ArrivalDate = require("./ArrivalDate");
const User = require("./User");

const Order = db.define('order', {
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
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    arrival_date_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: ArrivalDate,
            key: "id"
        }
    },
    user_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'user_id',
        references: {
            model: User,
            key: "id"
        }
    },
    status: {
        type: DataTypes.STRING(15),
        allowNull: false,
        defaultValue: 'BOOKED',
    },
    count_tickets: {
        type: DataTypes.SMALLINT,
        allowNull: false,
    },
},
{
    timestamps: false,
    tableName: 'orders_order',
    freezeTableName: true
})

module.exports = Order;