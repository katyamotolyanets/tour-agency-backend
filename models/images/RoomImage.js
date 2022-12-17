const { DataTypes } = require('sequelize');
const db = require('../../db-connection')
const RoomType = require("../RoomType");

const RoomImage = db.define('roomImage', {
        image_ptr_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        room_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: RoomType,
                key: "id"
            }
        }
    },
    {
        timestamps: false,
        tableName: 'images_roomimage',
        freezeTableName: true
    })

module.exports = RoomImage;