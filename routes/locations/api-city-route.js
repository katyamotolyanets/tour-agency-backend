const express = require('express')
const City = require("../../models/locations/City");
const Destination = require("../../models/locations/Destination");
const router = express.Router()

const {
    getCities,
} = require('../../controllers/locations/api-city-controller')

City.belongsTo(Destination, {foreignKey: 'destination_ptr_id'})

router.get('/api/cities', getCities);

module.exports = router