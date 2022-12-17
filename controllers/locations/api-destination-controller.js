require('dotenv').config();

const Destination = require("../../models/locations/Destination");

const getDestinations = (req, res) => {
    Destination.findAll().then(response => {
        res.status(200).json(response)
    })
}

module.exports = {
    getDestinations,
}