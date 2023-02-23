require('dotenv').config();
const Hotel = require("../models/Hotel");
const RoomType = require("../models/RoomType");
const City = require("../models/locations/City");
const Image = require("../models/images/Image");
const Destination = require("../models/locations/Destination");
const {getImagesArray} = require("../utils/utils");
const {checkAdminPermission} = require("../utils/utils");
const {checkFieldsValidation} = require("../utils/utils");

const getHotels = (req, res) => {
    Hotel.findAll(
        {
            attributes: [
                'id',
                'name',
                'stars_number',
                'street',
                'description',
            ],
            include: {
                model: City,
                attributes: ['destination_ptr_id'],
                include: {
                    model: Destination,
                    attributes: ['id', 'name', 'description']
                }
            }
        },
    ).then(response => {
        response.forEach(({dataValues}) => {
            dataValues.city = dataValues.city.destination;
        })
        res.status(200).json(response)
    })
}

const getHotelInfo = async (req, res) => {
    try {
        const {id} = req.params;
        return Hotel.findOne({
            where: {id: id},
            attributes: {
                exclude: ['created', 'modified', 'city_id']
            },
            include: [
                {
                    model: City,
                    attributes: ['destination_ptr_id'],
                    include: {
                        model: Destination,
                        attributes: ['id', 'name', 'description']
                    }
                },
                {
                    model: RoomType,
                    attributes: {
                        exclude: ['created', 'modified']
                    },
                    include: {
                        model: Image,
                        attributes: ['image']
                    }
                },
                {
                    model: Image,
                    attributes: ['image']
                }
            ]
        }).then(async ({dataValues}) => {
            let room_types = dataValues.room_types.map(roomType => {
                let {id, name, count_places, is_family, cost_per_day, description, square, count_rooms } = roomType;
                let result = {
                    id: id,
                    name: name,
                    count_places: count_places,
                    is_family: is_family,
                    cost_per_day: cost_per_day,
                    description: description,
                    square: square,
                    count_rooms: count_rooms,
                };
                result.images = getImagesArray(roomType.images);
                return result;
            });
            dataValues.city = dataValues.city.destination;
            dataValues.room_types = await Promise.all([...room_types]);
            dataValues.images = getImagesArray(dataValues.images);
            res.status(200).json(dataValues);
        })

    } catch (error) {
        res.status(400).json(error);
    }
}

const createHotel = async (req, res) => {
    try {
        let errors = await checkFieldsValidation(req);
        if (errors?.length > 0)
            return res.status(400).json(errors)
        const isAdmin = await checkAdminPermission(req.headers.authorization);
        if (!isAdmin)
            res.status(401).json({detail: 'You do not have such permissions'});
        const {name, stars_number, city, street} = req.body;
        const body = {
            name: name,
            stars_number: stars_number,
            city_id: city,
            street: street,
            description: req.body.description || null
        }
        let hotel = await Hotel.create(body);
        await hotel.save();
        res.status(200).json(hotel);
    } catch (error) {
        res.status(400).json({detail: 'Cannot create hotel, please check name and street, they should be unique'});
    }
}

const deleteHotel = async (req, res) => {
    try {
        const isAdmin = await checkAdminPermission(req.headers.authorization);
        if (!isAdmin)
            res.status(401).json({detail: 'You do not have such permissions'});
        const {id} = req.params;
        const hotel = await Hotel.findOne({
            where: {id: id},
        })
        await hotel.destroy();
        res.status(204).json({});
    } catch (error) {
        res.status(400).json({detail: 'Cannot delete hotel'});
    }
}

const updateHotel = async (req, res) => {
    try {
        const isAdmin = await checkAdminPermission(req.headers.authorization);
        if (!isAdmin)
            res.status(401).json({detail: 'You do not have such permissions'});
        const {id} = req.params;
        const hotel = await Hotel.findOne({
            where: { id: id },
        })
        await hotel.update(req.body);
        res.status(200).json(hotel);
    } catch (error) {
        res.status(400).json({detail: 'Cannot update hotel'});
    }
}

module.exports = {
    getHotels,
    deleteHotel,
    createHotel,
    updateHotel,
    getHotelInfo
}