require('dotenv').config();

const Country = require("../../models/locations/Country");

const getCountries = (req, res) => {
    Country.findAll().then(response => {
        res.status(200).json(response)
    })
}

module.exports = {
    getCountries,
}