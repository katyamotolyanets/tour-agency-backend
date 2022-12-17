const express = require('express')
const router = express.Router()

const {
    getHotelImages,
} = require('../../controllers/images/api-hotelImage-controller')

router.get('/api/hotel-images', getHotelImages);

module.exports = router