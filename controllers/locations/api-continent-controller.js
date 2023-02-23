require('dotenv').config();

const Continent = require("../../models/locations/Continent");
const Country = require("../../models/locations/Country");

const getContinents = (req, res) => {
    Continent.findAll({
        attributes: ['id', 'name'],
        include: {
            model: Country,
            attributes: ['id', 'name']
        }
    }).then(response => {
        res.status(200).json(response)
    })
}

module.exports = {
    getContinents,
}