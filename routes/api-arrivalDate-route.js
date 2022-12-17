const express = require('express')
const ArrivalDate = require("../models/ArrivalDate");
const Tour = require("../models/Tour");
const router = express.Router()

const {
    getArrivalDates,
} = require('../controllers/api-arrivalDate-controller')

ArrivalDate.belongsTo(Tour, {foreignKey: 'tour_id'});

router.get('/api/arrivals/', getArrivalDates);

module.exports = router