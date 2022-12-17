require('dotenv').config();

const City = require("../../models/locations/City");

const getCities = (req, res) => {
    City.findAll().then(response => {
        res.status(200).json(response)
    })
}

module.exports = {
    getCities,
}