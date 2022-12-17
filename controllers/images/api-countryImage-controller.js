require('dotenv').config();

const CountryImage = require("../../models/images/CountryImage");

const getCountryImages = (req, res) => {
    CountryImage.findAll().then(response => {
        res.status(200).json(response)
    })
}

module.exports = {
    getCountryImages,
}