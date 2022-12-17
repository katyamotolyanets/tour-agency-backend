const express = require('express')
const router = express.Router()

const {
    getCountries,
} = require('../../controllers/locations/api-country-controller')

router.get('/api/countries', getCountries);

module.exports = router