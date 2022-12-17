const express = require('express')
const router = express.Router()

const {
    getContinents,
} = require('../../controllers/locations/api-continent-controller')

router.get('/api/continents', getContinents);

module.exports = router