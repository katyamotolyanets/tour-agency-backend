require('dotenv').config();
const Destination = require("../../models/locations/Destination");
const Country = require("../../models/locations/Country");
const {checkAdminPermission} = require("../../utils/utils");
const {checkFieldsValidation} = require("../../utils/utils");

const getDestinations = (req, res) => {
    Destination.findAll({
        include: {
            model: Country,
            attributes: ['id', 'name']
        }
    }).then(response => {
        res.status(200).json(response)
    })
}

const getDestinationInfo = async (req, res) => {
    try {
        const {id} = req.params;
        Destination.findOne({
            where: {id: id},
            include: {
                model: Country,
                attributes: ['id', 'name']
            }
        }).then(response => {
            res.status(200).json(response)
        })
    } catch (error) {
        res.status(400).json(error)
    }
}

const createDestination = async (req, res) => {
    try {
        let errors = await checkFieldsValidation(req);
        if (errors?.length > 0)
            return res.status(400).json(errors)
        const isAdmin = await checkAdminPermission(req.headers.authorization);
        if (!isAdmin)
            res.status(401).json({detail: 'You do not have such permissions'});
        const {name, country} = req.body;
        const body = {
            name: name,
            country_id: country,
            description: req.body.description || null
        }
        let destination = await Destination.create(body);
        await destination.save();
        res.status(200).json(destination);
    } catch (error) {
        res.status(400).json({detail: 'Cannot create destination, please check entered name, it should be unique'});
    }
}

const deleteDestination = async (req, res) => {
    const isAdmin = await checkAdminPermission(req.headers.authorization);
    if (!isAdmin)
        res.status(401).json({detail: 'You do not have such permissions'});
    const {id} = req.params;
    await Destination.destroy({
        where: { id: id },
    }).then(() => {
        res.status(204).json({});
    })
}

const updateDestination = async (req, res) => {
    try {
        const isAdmin = await checkAdminPermission(req.headers.authorization);
        if (!isAdmin)
            res.status(401).json({detail: 'You do not have such permissions'});
        const {id} = req.params;
        const destination = await Destination.findOne({
            where: { id: id },
        })
        await destination.update(req.body);
        res.status(200).json(destination);
    } catch (error) {
        res.status(400).json({detail: 'Cannot update destination'});
    }
}

module.exports = {
    getDestinations,
    deleteDestination,
    createDestination,
    updateDestination,
    getDestinationInfo
}