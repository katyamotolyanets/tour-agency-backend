require('dotenv').config();

const OrderRoom = require("../models/OrderRoom");

const getOrderRooms = (req, res) => {
    OrderRoom.findAll().then(response => {
        res.status(200).json(response)
    })
}

module.exports = {
    getOrderRooms,
}