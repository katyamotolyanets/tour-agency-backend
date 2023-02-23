const { DataTypes } = require('sequelize');
const db = require('../db-connection')
const Tour = require("./Tour");

const ArrivalDate = db.define('arrival_date', {
        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        discount: {
            type: DataTypes.SMALLINT,
            allowNull: true,
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
    },
    {
        timestamps: false,
        tableName: 'tours_arrivaldates',
        freezeTableName: true
    })

module.exports = ArrivalDate;