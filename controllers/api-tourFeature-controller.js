require('dotenv').config();

const TourFeature = require("../models/TourFeature");

// add admin token
const getTourFeatures = (req, res) => {
    TourFeature.findAll().then(response => {
        res.status(200).json(response)
    })
}

module.exports = {
    getTourFeatures,
}