const express = require('express')
const RoomType = require("../models/RoomType");
const Hotel = require("../models/Hotel");
const router = express.Router()

const {
    getRoomTypes,
} = require('../controllers/api-roomType-controller')

RoomType.belongsTo(Hotel, {foreignKey: 'hotel_id'})
Hotel.hasMany(RoomType, {foreignKey: 'hotel_id'})

router.get('/api/room-types/', getRoomTypes);

module.exports = router