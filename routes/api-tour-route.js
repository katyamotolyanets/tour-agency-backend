const express = require('express')
const Tour = require("../models/Tour");
const Image = require("../models/images/Image");
const TourImage = require("../models/images/TourImage");
const {check} = require("express-validator");
const router = express.Router()

const {
    getTours,
    deleteTour,
    createTour,
    updateTour,
    getTourDetailInfo,
    getFilterParams
} = require('../controllers/api-tour-controller');

Tour.belongsToMany(Image,{through: TourImage, foreignKey: 'tour_id'})
Image.belongsToMany(Tour,{through: TourImage, foreignKey: 'image_ptr_id'})

router.get('/api/tours', getTours);
router.get('/api/tours/filter_params/', getFilterParams);
router.delete('/api/tours/:id/', deleteTour);
router.post('/api/tours/', [
    check('title')
        .notEmpty()
        .withMessage('Title field is required')
        .isLength({max: 256})
        .withMessage('Title length should be less than 256 characters'),
    check('tour_type')
        .notEmpty()
        .withMessage('Tour type is required'),
    check('price')
        .notEmpty()
        .withMessage('Price is required')
        .isNumeric()
        .withMessage('Price is a numeric type'),
], createTour)
router.patch('/api/tours/:id', updateTour);
router.get('/api/tours/:id', getTourDetailInfo);

module.exports = router