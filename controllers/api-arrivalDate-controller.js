require('dotenv').config();

const ArrivalDate = require("../models/ArrivalDate");

const getArrivalDates = (req, res) => {
    ArrivalDate.findAll().then(response => {
        res.status(200).json(response)
    })
}

module.exports = {
    getArrivalDates,
}