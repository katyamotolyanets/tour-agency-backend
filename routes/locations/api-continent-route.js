const express = require('express')
const Continent = require("../../models/locations/Continent");
const Country = require("../../models/locations/Country");
const router = express.Router()

const {
    getContinents,
} = require('../../controllers/locations/api-continent-controller')

Continent.hasMany(Country, {foreignKey: 'continent_id'})
Country.belongsTo(Continent, {foreignKey: 'continent_id'})

router.get('/api/continents', getContinents);

module.exports = router