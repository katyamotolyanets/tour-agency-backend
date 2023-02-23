require('dotenv').config();

const RoomType = require("../models/RoomType");
const {checkAdminPermission} = require("../utils/utils");
const {checkFieldsValidation} = require("../utils/utils");

const getRoomTypes = (req, res) => {
    RoomType.findAll().then(response => {
        res.status(200).json(response)
    })
}

const createRoom = async (req, res) => {
    try {
        let errors = await checkFieldsValidation(req);
        if (errors?.length > 0)
            return res.status(400).json(errors)
        const isAdmin = await checkAdminPermission(req.headers.authorization);
        if (!isAdmin)
            res.status(401).json({detail: 'You do not have such permissions'});
        const {name, hotel, count_rooms, count_places, is_family, cost_per_day, square, conveniences} = req.body;
        const body = {
            name: name,
            count_places: count_places,
            is_family: is_family,
            cost_per_day: cost_per_day,
            square: square,
            hotel_id: hotel,
            count_rooms: count_rooms,
            description: req.body.description || null,
            conveniences: conveniences
        }
        let room = await RoomType.create(body);
        await room.save();
        res.status(200).json(room);
    } catch (error) {
        res.status(400).json({detail: 'Cannot create room, please check name, it should be unique'});
    }
}

const deleteRoom = async (req, res) => {
    try {
        const isAdmin = await checkAdminPermission(req.headers.authorization);
        if (!isAdmin)
            res.status(401).json({detail: 'You do not have such permissions'});
        const {id} = req.params;
        const room = await RoomType.findOne({
            where: {id: id},
        })
        await room.destroy();
        res.status(204).json({});
    } catch (error) {
        res.status(400).json({detail: 'Cannot delete room'});
    }
}

const updateRoom = async (req, res) => {
    try {
        const isAdmin = await checkAdminPermission(req.headers.authorization);
        if (!isAdmin)
            res.status(401).json({detail: 'You do not have such permissions'});
        const {id} = req.params;
        const room = await RoomType.findOne({
            where: { id: id },
        })
        await room.update(req.body);
        res.status(200).json(room);
    } catch (error) {
        res.status(400).json({detail: 'Cannot update room'});
    }
}

const getRoomInfo = async (req, res) => {
    try {
        const {id} = req.params;
        await RoomType.findOne({
            where: {id: id},
            attributes: {exclude: []}
        }).then(response => res.status(200).json(response))
    } catch (error) {
        res.status(400).json(error)
    }
}

module.exports = {
    getRoomTypes,
    createRoom,
    deleteRoom,
    updateRoom,
    getRoomInfo
}