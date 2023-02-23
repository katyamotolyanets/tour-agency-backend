const express = require('express')
const TourFeature = require("../models/TourFeature");
const OrderRoom = require("../models/OrderRoom");
const router = express.Router()

const {
    getOrderRooms,
} = require('../controllers/api-orderRoom-controller')

TourFeature.hasMany(OrderRoom, {foreignKey: 'feature_id', onDelete: 'cascade', hooks: true});
OrderRoom.belongsTo(TourFeature, {foreignKey: 'feature_id'});

router.get('/api/order-rooms', getOrderRooms);

module.exports = router