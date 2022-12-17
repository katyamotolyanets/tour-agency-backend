const express = require('express')
const router = express.Router()

const {
    getTours,
} = require('../controllers/api-tour-controller')

router.get('/api/tours/', getTours);

module.exports = router