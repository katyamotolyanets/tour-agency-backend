require('dotenv').config();

const RoomType = require("../models/RoomType");

const getRoomTypes = (req, res) => {
    RoomType.findAll().then(response => {
        res.status(200).json(response)
    })
}

module.exports = {
    getRoomTypes,
}