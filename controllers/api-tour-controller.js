require('dotenv').config();

const Tour = require("../models/Tour");
const ArrivalDate = require("../models/ArrivalDate");
const TourFeature = require("../models/TourFeature");
const Destination = require("../models/locations/Destination");
const Hotel = require("../models/Hotel");
const Image = require("../models/images/Image");
const Order = require("../models/Order");
const RoomType = require("../models/RoomType");
const {getImagesArray} = require("../utils/utils");
const {checkFieldsValidation} = require("../utils/utils");
const {checkAdminPermission} = require("../utils/utils");

let tour_types = [
    ['LAND', "Land Tour"],
    ['ONE_DESTINATION', "One Destination Journey"],
    ['RIVER', "River Cruises"],
    ['SMALL_SHIP', "Small Ship Cruises"],
    ['FAMILY', "Family Journeys"]
]

const getTours = (req, res) => {
    Tour.findAll({
        attributes: {
            exclude: ['created', 'modified']
        },
        include: [
            {
                model: Image,
                attributes: ['image']
            },
            {
                model: ArrivalDate,
                attributes: {exclude: ['tour_id']},
            },
            {
                model: TourFeature,
                attributes: {exclude: ['created', 'modified', 'destination_id', 'hotel_id', '_order']},
                include: [
                    {
                        model: Destination,
                        attributes: {exclude: ['created', 'modified', 'image_id']},
                    },
                    {
                        model: Hotel,
                        attributes: ['id', 'name'],
                        include: [
                            {
                                model: RoomType,
                                attributes: ['cost_per_day']
                            },
                            {
                                model: Image,
                                attributes: ['image']
                            }
                        ]
                    }
                ]
            }
        ]
    }).then(async (response) => {
        let tours = response.map(tour => {
            return generateResponseForTour(tour.id).then(async dataValues => {
                let min_price = 0, totalDays = 0;
                let result = {
                    id: dataValues.id,
                    title: dataValues.title,
                    description: dataValues.description,
                    tour_type: dataValues.tour_type,
                    price: dataValues.price,
                    max_passengers: dataValues.max_passengers,
                    features: dataValues.features
                };
                let dates = dataValues.arrival_dates.map(async date => {
                    return getCountOfAvailableTickets(date.id).then(data => {
                        let res = {
                            id: date.id,
                            discount: date.discount,
                            date: date.date,
                            count_available: data
                        }
                        return res;
                    });
                })
                result.arrival_dates = await Promise.all([...dates]);
                dataValues.features
                    .sort((a, b) => Number(a.dataValues.id) - Number(b.dataValues.id))
                    .forEach(({dataValues}) => {
                        totalDays += dataValues.days
                        if (dataValues?.hotel) {
                            let min = dataValues.hotel.dataValues.room_types
                                .sort((a, b) => Number(a.dataValues.cost_per_day) - Number(b.dataValues.cost_per_day)).slice(0, 1)
                            min_price += (Number(min[0].dataValues.cost_per_day) * dataValues.days)
                        }
                    })
                result.images = getImagesArray(dataValues.images);
                result.days = totalDays;
                result.min_price = min_price + Number(dataValues.price);
                return result
            })
        })
        response = await Promise.all([...tours])

        if (req.query.destinations) {
            let destinations = req.query.destinations.split(',');
            response = response.filter(tour => {
                for (let i = 0; i < tour.features.length; i++) {
                    if(destinations.includes(tour.features[i].destination.id))
                        return true
                }
            });
        }
        if (req.query.tour_type) {
            let {tour_type} = req.query;
            response = response.filter(tour => (tour.tour_type === tour_type));
        }
        if (req.query.start_date) {
            let {start_date} = req.query;
            response = response.filter(tour => {
                for (let i = 0; i < tour.arrival_dates.length; i++) {
                    if (req.query.end_date) {
                        if (new Date(tour.arrival_dates[i].date) >= new Date(start_date) && new Date(tour.arrival_dates[i].date) <= new Date(req.query.end_date))
                            return true
                    } else {
                        if (new Date(tour.arrival_dates[i].date) >= new Date(start_date))
                            return true
                    }

                }
            });

        }

        res.status(200).json(response)
    });

}

const generateResponseForTour = async (id) => {
    return Tour.findOne({
        where: {id: id},
        attributes: {
            exclude: ['created', 'modified']
        },
        include: [
            {
                model: Image,
                attributes: ['image']
            },
            {
                model: ArrivalDate,
                attributes: {exclude: ['tour_id']},
            },
            {
                model: TourFeature,
                attributes: {exclude: ['created', 'modified', 'destination_id', 'hotel_id', '_order']},
                include: [
                    {
                        model: Destination,
                        attributes: {exclude: ['created', 'modified', 'image_id']},
                    },
                    {
                        model: Hotel,
                        attributes: ['id', 'name'],
                        include: [
                            {
                                model: RoomType,
                                attributes: ['cost_per_day']
                            },
                            {
                                model: Image,
                                attributes: ['image']
                            }
                        ]
                    }
                ]
            }
        ]
    })
}

const createTour = async (req, res) => {
    try {
        let errors = await checkFieldsValidation(req);
        if (errors?.length > 0)
            return res.status(400).json(errors)
        const isAdmin = await checkAdminPermission(req.headers.authorization);
        if (!isAdmin)
            res.status(401).json({detail: 'You do not have such permissions'});
        const {title, tour_type, price} = req.body;
        const body = {
            title: title,
            tour_type: tour_type,
            max_passengers: req.body.max_passengers || null,
            price: price,
            description: req.body.description || null
        }
        let tour = await Tour.create(body);
        await tour.save();
        res.status(200).json(tour);
    } catch (error) {
        res.status(400).json({detail: 'Cannot create tour, please check your title, it should be unique'});
    }
}

const deleteTour = async (req, res) => {
    try {
        const isAdmin = await checkAdminPermission(req.headers.authorization);
        if (!isAdmin)
            res.status(401).json({detail: 'You do not have such permissions'});
        const {id} = req.params;
        const tour = await Tour.findOne({
            where: { id: id },
        })
        await tour.destroy();
        res.status(204).json({});
    } catch (error) {
        res.status(400).json({detail: 'Cannot delete tour'});
    }
}

const updateTour = async (req, res) => {
    try {
        const isAdmin = await checkAdminPermission(req.headers.authorization);
        if (!isAdmin)
            res.status(401).json({detail: 'You do not have such permissions'});
        const {id} = req.params;
        const tour = await Tour.findOne({
            where: { id: id },
        })
        await tour.update(req.body);
        res.status(200).json(tour);
    } catch (error) {
        console.log(error)
        res.status(400).json({detail: 'Cannot update tour'});
    }
}

const getCountOfAvailableTickets = (arrivalDate) => {
    let countOfOrderedPassengers = 0;
    return ArrivalDate.findOne({
        where: {id: arrivalDate},
        attributes: ['id'],
        include: [{
            model: Order,
            attributes: ['count_tickets']
        },
            {
                model: Tour,
                attributes: ['max_passengers']
            }
        ]
    }).then(({dataValues}) => {
        dataValues.orders.forEach(({count_tickets}) => {
            countOfOrderedPassengers += count_tickets;
        })
        if (dataValues.tour.max_passengers) {
            return Number(dataValues.tour.max_passengers) - countOfOrderedPassengers;
        }
    })
}

const getTourDetailInfo = async (req, res) => {
    try {
        const {id} = req.params;
        return Tour.findOne({
            where: {id: id},
            attributes: {
                exclude: ['created', 'modified']
            },
            include: [
                {
                    model: Image,
                    attributes: ['image']
                },
                {
                    model: ArrivalDate,
                    attributes: {exclude: ['tour_id']},
                },
                {
                    model: TourFeature,
                    attributes: {exclude: ['created', 'modified', 'destination_id', 'hotel_id', '_order']},
                    include: [
                        {
                            model: Destination,
                            attributes: {exclude: ['created', 'modified', 'image_id']},
                        },
                        {
                            model: Hotel,
                            attributes: ['id', 'name'],
                            include: [
                                {
                                    model: RoomType,
                                    attributes: ['cost_per_day']
                                },
                                {
                                    model: Image,
                                    attributes: ['image']
                                }
                            ]
                        }
                    ]
                }
            ]
        }).then(async ({dataValues}) => {
            let min_price = 0, totalDays = 0;
            let dates = dataValues.arrival_dates.map(async date => {
                return getCountOfAvailableTickets(date.id).then(data => {
                    let res = {
                        id: date.id,
                        discount: date.discount,
                        date: date.date,
                        count_available: data
                    }
                    return res;
                });
            })
            dataValues.arrival_dates = await Promise.all([...dates]);
            dataValues.features
                .sort((a, b) => Number(a.dataValues.id) - Number(b.dataValues.id))
                .forEach(({dataValues}) => {
                    totalDays += dataValues.days
                    if (dataValues?.hotel) {
                        let min = dataValues.hotel.dataValues.room_types
                            .sort((a, b) => Number(a.dataValues.cost_per_day) - Number(b.dataValues.cost_per_day)).slice(0, 1)
                        min_price += (Number(min[0].dataValues.cost_per_day) * dataValues.days)
                    }
                })

            let features = dataValues.features.map(({id, title, description, food, days, hotel, destination }) => {
                let result = {
                    id: id,
                    title: title,
                    description: description,
                    food: food,
                    days: days,
                    destination: destination
                }
                if (hotel) {
                    let newHotelInfo = {
                        id: hotel.id,
                        name: hotel.name,
                    }
                    newHotelInfo.image = 'http://localhost:5000/media/' + hotel.images[0].image
                    result.hotel = newHotelInfo
                }
                return result
            })
            dataValues.features = await Promise.all([...features]);
            dataValues.images = getImagesArray(dataValues.images);
            dataValues.days = totalDays;
            dataValues.min_price = min_price + Number(dataValues.price);
            res.status(200).json(dataValues)
        })
    } catch (error) {
        res.status(400).json({detail: 'Cannot get tour info'})
    }
}

const getFilterParams = async (req, res) => {
    try {
        let destinations = await Destination.findAll({
            attributes: ['id', 'name']
        });
        let response = {};
        response.destinations = destinations;
        response.tour_types = tour_types;
        res.status(200).json(response)
    } catch (error) {
        res.status(400).json(error)
    }
}

module.exports = {
    getTours,
    deleteTour,
    createTour,
    updateTour,
    getTourDetailInfo,
    getFilterParams
}