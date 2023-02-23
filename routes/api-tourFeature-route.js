const express = require('express')
const TourFeature = require("../models/TourFeature");
const Tour = require("../models/Tour");
const Destination = require("../models/locations/Destination");
const Hotel = require("../models/Hotel");
const OrderRoom = require("../models/OrderRoom");
const {check} = require("express-validator");
const router = express.Router()

const {
    getTourFeatures,
    deleteFeature,
    createFeature,
    updateFeature,
} = require('../controllers/api-tourFeature-controller')

Tour.hasMany(TourFeature, {foreignKey: 'tour_id', onUpdate: 'cascade', onDelete: 'cascade', hooks: true})
TourFeature.belongsTo(Tour, {foreignKey: 'tour_id'})

Destination.hasMany(TourFeature, {foreignKey: 'destination_id', onDelete: 'cascade', hooks: true})
TourFeature.belongsTo(Destination, {foreignKey: 'destination_id'})

TourFeature.belongsTo(Hotel, {foreignKey: 'hotel_id', onDelete: 'SET NULL'})

TourFeature.hasMany(OrderRoom, {foreignKey: 'feature_id', onDelete: 'cascade', hooks: true})
OrderRoom.belongsTo(TourFeature, {foreignKey: 'feature_id', onDelete: 'cascade', hooks: true})

/*Destination.belongsToMany(Tour, {through: TourFeature, foreignKey: 'destination_id'})

Tour.belongsToMany(Destination, {through: TourFeature, foreignKey: 'tour_id'})*/

router.get('/api/features/', getTourFeatures);
router.post('/api/features/', [
    check('title')
        .notEmpty()
        .withMessage('Title field is required')
        .isLength({max: 256})
        .withMessage('Title length should be less than 256 characters'),
    check('tour')
        .notEmpty()
        .withMessage('Tour id is required'),
    check('destination')
        .notEmpty()
        .withMessage('Destination id is required'),
    check('days')
        .notEmpty()
        .withMessage('Days is required')
        .isInt({min: 1})
        .withMessage('Days should be greater than 0'),
], createFeature);
router.delete('/api/features/:id/', deleteFeature);
router.patch('/api/features/:id/', updateFeature);

module.exports = router