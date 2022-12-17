require('dotenv').config();

const HotelImage = require("../../models/images/HotelImage");

const getHotelImages = (req, res) => {
    HotelImage.findAll().then(response => {
        res.status(200).json(response)
    })
}

module.exports = {
    getHotelImages,
}