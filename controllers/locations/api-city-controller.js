require('dotenv').config();

const City = require("../../models/locations/City");
const Destination = require("../../models/locations/Destination");

const getCities = async (req, res) => {
    await City.findAll(
        {
            attributes: {exclude: ['created', 'modified']},
            include: {
                model: Destination,
                attributes: ['id', 'name', 'description']
            }
        },
    ).then(response => {
        let result = response.map(({destination}) => destination)
        res.status(200).json(result)
    })
}

module.exports = {
    getCities,
}