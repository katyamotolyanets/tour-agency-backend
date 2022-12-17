const express = require('express')
const TourFeature = require("../models/TourFeature");
const Tour = require("../models/Tour");
const Destination = require("../models/locations/Destination");
const Hotel = require("../models/Hotel");
const router = express.Router()

const {
    getTourFeatures,
} = require('../controllers/api-tourFeature-controller')

Tour.hasMany(TourFeature, {foreignKey: 'tour_id'})
TourFeature.belongsTo(Destination, {foreignKey: 'destination_id'})
TourFeature.belongsTo(Hotel, {foreignKey: 'hotel_id'})

/*Destination.belongsToMany(Tour, {through: TourFeature, foreignKey: 'destination_id'})

Tour.belongsToMany(Destination, {through: TourFeature, foreignKey: 'tour_id'})*/

router.get('/api/features/', getTourFeatures);

module.exports = router