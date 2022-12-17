const express = require('express')
const Destination = require("../../models/locations/Destination");
const TourFeature = require("../../models/TourFeature");
const router = express.Router()

const {
    getDestinations,
} = require('../../controllers/locations/api-destination-controller')

router.get('/api/destinations', getDestinations);

module.exports = router