const { DataTypes } = require('sequelize');
const db = require('../../db-connection')
const Hotel = require("../Hotel");

const HotelImage = db.define('hotelImage', {
        image_ptr_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        hotel_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: Hotel,
                key: "id"
            }
        }
    },
    {
        timestamps: false,
        tableName: 'images_hotelimage',
        freezeTableName: true
    })

module.exports = HotelImage;