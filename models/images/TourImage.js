const { DataTypes } = require('sequelize');
const db = require('../../db-connection')
const Tour = require("../Tour");

const TourImage = db.define('tourImage', {
        image_ptr_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        tour_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: Tour,
                key: "id"
            }
        }
    },
    {
        timestamps: false,
        tableName: 'images_tourimage',
        freezeTableName: true
    })

module.exports = TourImage;