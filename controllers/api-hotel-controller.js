require('dotenv').config();

const Hotel = require("../models/Hotel");

const getHotels = (req, res) => {
    Hotel.findAll(
        {
            attributes: [
                'id',
                'name',
                'stars_number',
                'city_id',
                'street',
                'description',
            ]
        },
    ).then(response => {
        res.status(200).json(response)
    })
}

module.exports = {
    getHotels,
}