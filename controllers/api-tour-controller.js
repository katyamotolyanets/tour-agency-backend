require('dotenv').config();

const Tour = require("../models/Tour");

const getTours = (req, res) => {
    Tour.findAll(
        {
            attributes: [
                'id',
                'title',
                'tour_type',
                'description',
            ]
        },
    ).then(response => {
        res.status(200).json(response)
    })
}

module.exports = {
    getTours,
}