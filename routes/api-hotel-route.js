const express = require('express')
const Hotel = require("../models/Hotel");
const Image = require("../models/images/Image");
const HotelImage = require("../models/images/HotelImage");
const City = require("../models/locations/City");
const {check} = require("express-validator");
const router = express.Router()

const {
    getHotels,
    deleteHotel,
    createHotel,
    updateHotel,
    getHotelInfo
} = require('../controllers/api-hotel-controller')

Hotel.belongsToMany(Image,{through: HotelImage, foreignKey: 'hotel_id'})
Image.belongsToMany(Hotel,{through: HotelImage, foreignKey: 'image_ptr_id'})

Hotel.belongsTo(City,{foreignKey: 'city_id'})
City.hasMany(Hotel,{foreignKey: 'city_id'})

router.get('/api/hotels', getHotels);
router.post('/api/hotels/', [
    check('name')
        .notEmpty()
        .withMessage('Name is required'),
    check('city')
        .notEmpty()
        .withMessage('City id is required'),
    check('street')
        .notEmpty()
        .withMessage('Street is required'),
    check('stars_number')
        .notEmpty()
        .withMessage('Stars number is required')
        .isInt({min: 1, max: 5})
        .withMessage('Stars number should be between 1 and 5'),

], createHotel);
router.delete('/api/hotels/:id/', deleteHotel);
router.patch('/api/hotels/:id/', updateHotel);
router.get('/api/hotels/:id/', getHotelInfo);

module.exports = router