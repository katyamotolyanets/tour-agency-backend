const express = require('express')
const RoomType = require("../models/RoomType");
const Hotel = require("../models/Hotel");
const RoomImage = require("../models/images/RoomImage");
const Image = require("../models/images/Image");
const {check} = require("express-validator");
const router = express.Router()

const {
    getRoomTypes,
    createRoom,
    deleteRoom,
    updateRoom,
    getRoomInfo
} = require('../controllers/api-roomType-controller')

Hotel.hasMany(RoomType, {foreignKey: 'hotel_id', onDelete: 'cascade', hooks: true});
RoomType.belongsTo(Hotel, {foreignKey: 'hotel_id'});

RoomType.belongsToMany(Image,{through: RoomImage, foreignKey: 'room_id'});
Image.belongsToMany(RoomType,{through: RoomImage, foreignKey: 'image_ptr_id'});

router.get('/api/rooms/', getRoomTypes);
router.get('/api/rooms/:id', getRoomInfo);
router.post('/api/rooms/', [
    check('name')
        .notEmpty()
        .withMessage('Name is required'),
    check('hotel')
        .notEmpty()
        .withMessage('Hotel id is required'),
    check('count_places')
        .notEmpty()
        .withMessage('Count of places is required')
        .isInt({min: 1, max: 5})
        .withMessage('Count of places should be between 1 and 5'),
    check('is_family')
        .notEmpty()
        .withMessage('is_family is required')
        .isBoolean(),
    check('cost_per_day')
        .notEmpty()
        .withMessage('Cost per day is required'),
    check('square')
        .notEmpty()
        .withMessage('Square is required'),
    check('count_rooms')
        .notEmpty()
        .withMessage('Count of rooms is required')
], createRoom);
router.delete('/api/rooms/:id', deleteRoom);
router.patch('/api/rooms/:id', updateRoom);

module.exports = router