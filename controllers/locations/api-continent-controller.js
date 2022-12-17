require('dotenv').config();

const Continent = require("../../models/locations/Continent");

const getContinents = (req, res) => {
    Continent.findAll().then(response => {
        res.status(200).json(response)
    })
}

module.exports = {
    getContinents,
}