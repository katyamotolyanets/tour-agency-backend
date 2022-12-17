const express = require('express')
const router = express.Router()

const {
    getOrderRooms,
} = require('../controllers/api-orderRoom-controller')

router.get('/api/order-rooms', getOrderRooms);

module.exports = router