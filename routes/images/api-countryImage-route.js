const express = require('express')
const router = express.Router()

const {
    getCountryImages,
} = require('../../controllers/images/api-countryImage-controller')

router.get('/api/country-images', getCountryImages);

module.exports = router