const express = require('express')
const router = express.Router()

const {
    getHotels,
} = require('../controllers/api-hotel-controller')

router.get('/api/hotels', getHotels);

module.exports = router