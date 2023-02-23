const express = require('express')
const Destination = require("../../models/locations/Destination");
const Country = require("../../models/locations/Country");
const {check} = require("express-validator");
const router = express.Router()

const {
    getDestinations,
    deleteDestination,
    createDestination,
    updateDestination,
    getDestinationInfo
} = require('../../controllers/locations/api-destination-controller')

Destination.belongsTo(Country, {foreignKey: 'country_id'})

router.get('/api/destinations', getDestinations);
router.post('/api/destinations/', [
    check('name')
        .notEmpty()
        .withMessage('Name is required'),
    check('country')
        .notEmpty()
        .withMessage('Country id is required'),
    /*check('longitude')
        .notEmpty()
        .withMessage('Longitude is required')
        .isFloat()
        .withMessage('Longitude is a float type'),
    check('latitude')
        .notEmpty()
        .withMessage('Latitude is required')
        .isFloat()
        .withMessage('Latitude is a float type'),*/
], createDestination);
router.delete('/api/destinations/:id', deleteDestination);
router.patch('/api/destinations/:id', updateDestination);
router.get('/api/destinations/:id', getDestinationInfo);

module.exports = router