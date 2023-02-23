require('dotenv').config();

const ArrivalDate = require("../models/ArrivalDate");
const Tour = require("../models/Tour");
const Image = require("../models/images/Image");
const TourFeature = require("../models/TourFeature");
const Destination = require("../models/locations/Destination");
const Hotel = require("../models/Hotel");
const City = require("../models/locations/City");
const RoomType = require("../models/RoomType");
const OrderRoom = require("../models/OrderRoom");
const {Op} = require("sequelize");
const {checkAdminPermission} = require("../utils/utils");
const {checkFieldsValidation} = require("../utils/utils");

const getArrivalDates = (req, res) => {
    ArrivalDate.findAll().then(response => {
        res.status(200).json(response)
    })
}

const getArrivalDateInfo = async (req, res) => {
    try {
        const {id} = req.params;
        return ArrivalDate.findOne({
            where: {id: id},
            attributes: ['id', 'date', 'discount'],
            include: {
                model: Tour,
                attributes: {exclude: ['created', 'modified']},
                include: [
                    {
                        model: TourFeature,
                        attributes: ['id', 'title', 'days', 'description'],
                        include: [
                            {
                                model: Hotel,
                                attributes: {exclude: ['created', 'modified']},
                                include: [
                                    {
                                        model: RoomType,
                                        attributes: {exclude: []},
                                        include: {
                                            model: Image,
                                            attributes: ['image']
                                        },
                                    },
                                ]
                            }
                        ]
                    }
                ]
            }
        }).then(async ({dataValues}) => {
            let min_price = 0, totalDays = 0;
            dataValues.tour.dataValues.features
                .sort((a, b) => Number(a.dataValues.id) - Number(b.dataValues.id))
                .forEach(({dataValues}) => {
                    totalDays += dataValues.days
                    if (dataValues?.hotel) {
                        let min = dataValues.hotel.dataValues.room_types
                            .sort((a, b) => Number(a.dataValues.cost_per_day) - Number(b.dataValues.cost_per_day)).slice(0, 1)
                        min_price += (Number(min[0].dataValues.cost_per_day) * dataValues.days)
                    }
                })
            let start = dataValues.date;
            let features = dataValues.tour.features.map(({id, title, days, description, hotel}) => {
                let result = {
                    id: id,
                    title: title,
                    days: days,
                    description: description
                }
                let end = new Date();
                end.setDate(start.getDate() + days);
                if (hotel) {

                    let rooms = hotel.room_types.filter(async (room) => {
                        let count = await OrderRoom.count({
                            where: [
                                {room_id: room.id},
                                {
                                    [Op.and]: [{
                                        start: {
                                            [Op.between]: [start, end]
                                        }
                                    }, {
                                        end: {
                                            [Op.between]: [start, end]
                                        }
                                    }]
                                }
                            ]
                        })
                        if (room.count_rooms > count) {
                            return room
                        }
                    })

                        let newHotelInfo = {
                            id: hotel.id,
                            name: hotel.name,
                        }
                        let roomsImg = rooms.map(({id, name, cost_per_day, images, count_places, description}) => {
                            let res = { id, name, cost_per_day, count_places, description}
                            let roomsImages = images.map(({image}) => 'http://localhost:5000/media/' + image);
                            res.images = roomsImages;
                            return res
                        })
                        newHotelInfo.room_types = roomsImg;
                        result.hotel = newHotelInfo
                }


                start = end;


                return result;
            })
            //dataValues.features = await Promise.all([...features]);
            dataValues.tour.dataValues.tourfeatures = features;
            dataValues.tour.dataValues.features = [];
            dataValues.tour.dataValues.days = totalDays;
            dataValues.tour.dataValues.min_price = min_price + Number(dataValues.tour.price);
            res.status(200).json(dataValues)

        })
    } catch (error) {
        res.status(400).json(error)
    }

}

const createArrivalDate = async (req, res) => {
    try {
        let errors = await checkFieldsValidation(req);
        if (errors?.length > 0)
            return res.status(400).json(errors)
        const isAdmin = await checkAdminPermission(req.headers.authorization);
        if (!isAdmin)
            res.status(401).json({detail: 'You do not have such permissions'});
        const {date, tour} = req.body;
        if (req.body.discount) {
            let tour = await Tour.findOne({where: {id: tour_id}})
            if (Number(tour.price) < req.body.discount) {
                res.status(400).json({detail: 'Discount should be less than tour price'})
            }
        }
        const body = {
            date: date,
            discount: req.body.discount || 0,
            tour_id: tour || null,
        }
        let arrivalDate = await ArrivalDate.create(body);
        await arrivalDate.save();
        res.status(200).json(arrivalDate);
    } catch (error) {
        res.status(400).json({detail: 'Cannot create arrival date'});
    }
}

const deleteArrivalDate = async (req, res) => {
    try {
        const isAdmin = await checkAdminPermission(req.headers.authorization);
        if (!isAdmin)
            res.status(401).json({detail: 'You do not have such permissions'});
        const {id} = req.params;
        const arrivalDate = await ArrivalDate.findOne({
            where: {id: id},
        })
        await arrivalDate.destroy();
        res.status(204).json({});
    } catch (error) {
        res.status(400).json({detail: 'Cannot delete arrival date'});
    }
}

const updateArrivalDate = async (req, res) => {
    try {
        const isAdmin = await checkAdminPermission(req.headers.authorization);
        if (!isAdmin)
            res.status(401).json({detail: 'You do not have such permissions'});
        const {id} = req.params;
        const arrivalDate = await ArrivalDate.findOne({
            where: { id: id },
        })
        await arrivalDate.update(req.body);
        res.status(200).json(arrivalDate);
    } catch (error) {
        res.status(400).json({detail: 'Cannot update arrival date'});
    }
}

module.exports = {
    getArrivalDates,
    createArrivalDate,
    deleteArrivalDate,
    updateArrivalDate,
    getArrivalDateInfo
}