const express = require('express')
const router = express.Router()

const {
    getCities,
} = require('../../controllers/locations/api-city-controller')

router.get('/api/cities', getCities);

module.exports = router