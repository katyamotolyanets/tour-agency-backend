const express = require('express')
const Order = require("../models/Order");
const User = require("../models/User");
const ArrivalDate = require("../models/ArrivalDate");
const {check} = require("express-validator");
const router = express.Router()

const {
    getOrders,
    createOrder,
    getOrderPrice
} = require('../controllers/api-order-controller')

Order.belongsTo(User, {foreignKey: 'user_id'});
Order.belongsTo(ArrivalDate, {foreignKey: 'arrival_date_id'});
ArrivalDate.hasMany(Order, {foreignKey: 'arrival_date_id'});

router.get('/api/orders', getOrders);

router.post('/api/orders/', [
    check('price')
        .notEmpty()
        .withMessage('Price field is required'),
    check('arrival_date_id')
        .notEmpty()
        .withMessage('Arrival date is required'),
    check('user_id')
        .notEmpty()
        .withMessage('User is required'),
    check('count_tickets')
        .notEmpty()
        .withMessage('Count of tickets is required')
        .isNumeric()
], createOrder);

router.post('/api/order/price/', [
    check('arrival_date')
        .notEmpty()
        .withMessage('Arrival date is required'),
    check('ordered_rooms')
        .notEmpty()
        .withMessage('Ordered rooms is required'),
    check('count_tickets')
        .notEmpty()
        .withMessage('Count of tickets is required')
        .isNumeric()
], getOrderPrice)


module.exports = router