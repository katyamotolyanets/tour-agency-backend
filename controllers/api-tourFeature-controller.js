require('dotenv').config();
const jwt = require("jsonwebtoken");
const TourFeature = require("../models/TourFeature");
const {checkAdminPermission} = require("../utils/utils");
const {checkFieldsValidation} = require("../utils/utils");


// add admin token
const getTourFeatures = (req, res) => {
    TourFeature.findAll().then(response => {
        res.status(200).json(response)
    })
}

const createFeature = async (req, res) => {
    try {
        let errors = await checkFieldsValidation(req);
        if (errors?.length > 0)
            return res.status(400).json(errors)
        const isAdmin = await checkAdminPermission(req.headers.authorization);
        if (!isAdmin)
            res.status(401).json({detail: 'You do not have such permissions'});
        const {tour, title, days, destination} = req.body;
        const body = {
            title: title,
            tour_id: tour,
            days: days,
            destination_id: destination,
            hotel_id: req.body.hotel || null,
            description: req.body.description || null,
            food: null
        }
        let feature = await TourFeature.create(body);
        await feature.save();
        res.status(200).json(feature);
    } catch (error) {
        res.status(400).json({detail: 'Cannot create feature, please check your title, it should be unique'});
    }
}

const deleteFeature = async (req, res) => {
    try {
        const isAdmin = await checkAdminPermission(req.headers.authorization);
        if (!isAdmin)
            res.status(401).json({detail: 'You do not have such permissions'});
        const {id} = req.params;
        await TourFeature.destroy({
            where: {id: id},
        }).then(() => {
            res.status(204).json({});
        })
    } catch (error) {
        res.status(400).json({detail: 'Cannot delete feature'});
    }
}

const updateFeature = async (req, res) => {
    try {
        const isAdmin = await checkAdminPermission(req.headers.authorization);
        if (!isAdmin)
            res.status(401).json({detail: 'You do not have such permissions'});
        const {id} = req.params;
        const feature = await TourFeature.findOne({
            where: { id: id },
        })
        await feature.update(req.body);
        res.status(200).json(feature);
    } catch (error) {
        res.status(400).json({detail: 'Cannot update feature'});
    }
}

module.exports = {
    getTourFeatures,
    deleteFeature,
    createFeature,
    updateFeature
}