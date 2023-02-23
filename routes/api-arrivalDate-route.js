const express = require('express')
const ArrivalDate = require("../models/ArrivalDate");
const Tour = require("../models/Tour");
const {check} = require("express-validator");
const router = express.Router()

const {
    getArrivalDates,
    createArrivalDate,
    deleteArrivalDate,
    updateArrivalDate,
    getArrivalDateInfo
} = require('../controllers/api-arrivalDate-controller')

Tour.hasMany(ArrivalDate, {foreignKey: 'tour_id', onDelete: 'cascade', hooks: true});
ArrivalDate.belongsTo(Tour, {foreignKey: 'tour_id'});

router.get('/api/arrivals/', getArrivalDates);
router.get('/api/arrivals/:id', getArrivalDateInfo);
router.post('/api/arrivals/', [
    check('date')
        .notEmpty()
        .withMessage('Date is required')
        .isDate()
        .withMessage('Date format is wrong')
], createArrivalDate);
router.delete('/api/arrivals/:id/', deleteArrivalDate);
router.patch('/api/arrivals/:id/', updateArrivalDate);



module.exports = router