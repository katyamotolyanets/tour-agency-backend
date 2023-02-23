require('dotenv').config();
const db = require('../db-connection')

const Order = require("../models/Order");
const User = require("../models/User");
const ArrivalDate = require("../models/ArrivalDate");
const Tour = require("../models/Tour");
const TourFeature = require("../models/TourFeature");
const Destination = require("../models/locations/Destination");
const Hotel = require("../models/Hotel");
const RoomType = require("../models/RoomType");
const jwt = require("jsonwebtoken");
const OrderRoom = require("../models/OrderRoom");
const {checkAdminPermission} = require("../utils/utils");
const {checkFieldsValidation} = require("../utils/utils");

const {JWT_ACCESS_SECRET_KEY} = process.env;

// add admin token
const getOrders = (req, res) => {
    Order.findAll({
        attributes: [
            'id',
            'price',
            'count_tickets',
            'status',
            'created',
        ],
        include: [
            {
                model: User,
                attributes: ['email']
            },
            {
                model: ArrivalDate,
                attributes: ['id', 'date'],
                include: {
                    model: Tour,
                    attributes: ['id', 'title', 'price', 'tour_type', 'description'],
                    include: {
                        model: TourFeature,
                        attributes: ['id', 'days'],
                        include: [
                            {
                                model: Destination,
                                attributes: ['name']
                            },
                            {
                                model: Hotel,
                                attributes: ['id'],
                                include: {
                                    model: RoomType,
                                    attributes: ['cost_per_day']
                                }
                            }
                        ]
                    }
                }
            }
        ],
    })
        .then(response => {
            response.forEach(({dataValues}) => {
                let destinations = [];
                let totalDays = 0;
                let min_price = 0;
                const tourPrice = dataValues.arrival_date.tour.dataValues.price;
                dataValues.user = dataValues.user.dataValues.email
                dataValues.arrival_date.tour.features
                    .sort((a, b) => Number(a.dataValues.id) - Number(b.dataValues.id))
                    .forEach(({dataValues}) => {
                        totalDays += dataValues.days
                        destinations.push(dataValues.destination.dataValues.name)
                        if (dataValues?.hotel) {
                            let min = dataValues.hotel.dataValues.room_types
                                .sort((a, b) => Number(a.dataValues.cost_per_day) - Number(b.dataValues.cost_per_day)).slice(0, 1)
                            min_price += (Number(min[0].dataValues.cost_per_day) * dataValues.days)
                        }
                    })

                dataValues.arrival_date.dataValues.tour.dataValues.destinations = destinations;
                dataValues.arrival_date.dataValues.tour.dataValues.days = totalDays;
                dataValues.arrival_date.dataValues.tour.dataValues.min_price = min_price + Number(tourPrice);

                delete dataValues.arrival_date.dataValues.tour.dataValues.features
                delete dataValues.arrival_date.dataValues.tour.dataValues.price
            })
            res.status(200).json(response)
        })
}

const bookRooms = async (order, orderRooms, user, transaction) => {
    let {arrival_date, count_tickets} = order?.dataValues;
    let start = arrival_date?.dataValues.date;
    let orderedRooms = [];
    let {features} = arrival_date.dataValues.tour.dataValues;
    features.forEach(({id, days}) => {
        let end = new Date();
        end.setDate(start.getDate() + days);
        let newOrderRoom = [];
        orderRooms.forEach(room => {
            console.log(room)
            if (room.feature == id) {
                newOrderRoom.push(room);
            }

        })
        console.log(newOrderRoom)

        if (newOrderRoom.length !== 1) {
            transaction.rollback();
            throw new Error('Each hotel must contain only one room');
        }
        let newOrderRoomId = newOrderRoom[0].room;
        orderedRooms.push({
            start: start,
            end: end,
            room_id: newOrderRoomId,
            user_id: user,
            feature_id: id,
            order_id: order.id
        })
        start = end;
    })
    for (const room of orderedRooms) {
        try {
            await checkCountTicketsAvailability(arrival_date.dataValues.id, count_tickets)
        } catch (e) {
            throw e
        }
        OrderRoom.create(room, {transaction: transaction}).then(orderRoom => {
            orderRoom.save();
        });
    }
}

const countAvailable = (arrival_date) => {
    let countOfOrderedPassengers = 0;
    return ArrivalDate.findOne({
        where: {id: arrival_date},
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

const checkCountTicketsAvailability = async (arrivalDate, count_tickets) => {
    const count = await countAvailable(arrivalDate);
    if (Number.isInteger(count) && (count - count_tickets) < 0) {
        throw new Error("The date has no available places")
    }
}

const createOrder = async (req, res) => {
    let transaction = await db.transaction();
    try {
        const accessToken = req.headers.authorization.split('Bearer ')[1];
        const {arrival_date, count_tickets, ordered_rooms} = req.body;
        const arrival = await ArrivalDate.findOne({
            where: {id: arrival_date},
            attributes: ['discount'],
            include: {
                model: Tour,
                attributes: ['price']
            }
        });
        let price = (Number(arrival?.tour?.price) - Number(arrival.discount)) * Number(count_tickets);
        let count = 0;
        ordered_rooms.forEach(({room, feature}) => {
            RoomType.findOne({
                where: {id: room},
                attributes: ['cost_per_day']
            }).then(({dataValues}) => {
                TourFeature.findOne({
                    where: {id: feature},
                    attributes: ['days']
                }).then((response) => {
                    price += Number(dataValues.cost_per_day) * response.dataValues.days;
                    count++;
                    if (count === ordered_rooms.length) {
                        jwt.verify(accessToken, JWT_ACCESS_SECRET_KEY, async (error, decoded) => {
                            if (error)
                                res.status(401).json({detail: 'You should log in for creating order'});
                            const {user} = decoded;
                            const orderInfo = {
                                price: price,
                                arrival_date_id: arrival_date,
                                user_id: user.id,
                                count_tickets: count_tickets
                            };
                            const order = await Order.create(orderInfo, {transaction: transaction});
                            await order.save();
                            return Order.findOne({
                                where: {id: order.dataValues.id},
                                attributes: {
                                    exclude: ['modified', 'user_id', 'arrival_date_id']
                                },
                                include: {
                                    model: ArrivalDate,
                                    attributes: ['id', 'date'],
                                    include: {
                                        model: Tour,
                                        attributes: ['id', 'title', 'price', 'tour_type', 'description'],
                                        include: {
                                            model: TourFeature,
                                            attributes: ['id', 'days', '_order'],
                                            include: [
                                                {
                                                    model: Destination,
                                                    attributes: ['name']
                                                },
                                                {
                                                    model: Hotel,
                                                    attributes: ['id'],
                                                    include: {
                                                        model: RoomType,
                                                        attributes: ['cost_per_day']
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                },
                                transaction: transaction
                            }).then(async (response) => {
                                try {
                                    await bookRooms(response, ordered_rooms, user.id, transaction)
                                } catch (e) {
                                    res.status(400).send(e.message)
                                    return;
                                }
                                let destinations = [];
                                let totalDays = 0;
                                let min_price = 0;
                                const tourPrice = response?.dataValues.arrival_date.dataValues.tour.dataValues.price;
                                response.dataValues.arrival_date.tour.features
                                    .sort((a, b) => a.dataValues._order - b.dataValues._order)
                                    .forEach(({dataValues}) => {
                                        totalDays += dataValues.days
                                        destinations.push(dataValues.destination.dataValues.name)
                                        if (dataValues?.hotel) {
                                            let min = dataValues.hotel.dataValues.room_types
                                                .sort((a, b) => Number(a.dataValues.cost_per_day) - Number(b.dataValues.cost_per_day)).slice(0, 1)
                                            min_price += (Number(min[0].dataValues.cost_per_day) * dataValues.days)
                                        }
                                    })

                                response.dataValues.arrival_date.dataValues.tour.dataValues.destinations = destinations;
                                response.dataValues.arrival_date.dataValues.tour.dataValues.days = totalDays;
                                response.dataValues.arrival_date.dataValues.tour.dataValues.min_price = min_price + Number(tourPrice);
                                response.dataValues.ordered_rooms = ordered_rooms;

                                delete response.dataValues.arrival_date.dataValues.tour.dataValues.features;
                                delete response.dataValues.arrival_date.dataValues.tour.dataValues.price;
                                res.status(200).json(response);
                            }).then(() => transaction.commit())
                        });
                    }
                })
            })

        });
    } catch (error) {
        await transaction.rollback();
        res.status(404).json(error)
    }
}

const getOrderPrice = async (req, res) => {
    await checkFieldsValidation(req, res);
    const {arrival_date, count_tickets, ordered_rooms} = req.body;
    const arrival = await ArrivalDate.findOne({
        where: {id: arrival_date},
        attributes: ['discount'],
        include: {
            model: Tour,
            attributes: ['price']
        }
    });
    let count = 0;
    let price = (Number(arrival?.tour?.price) - Number(arrival.discount)) * Number(count_tickets);
    ordered_rooms.forEach(({room, feature}) => {
        RoomType.findOne({
            where: {id: room},
            attributes: ['cost_per_day']
        }).then(({dataValues}) => {
            TourFeature.findOne({
                where: {id: feature},
                attributes: ['days']
            }).then((response) => {
                price += Number(dataValues.cost_per_day) * response.dataValues.days;
                count++;
                if (count === ordered_rooms.length) {
                    res.status(200).json(price)
                }
            })
        })
    });
}

const deleteOrder = async (req, res) => {
    try {
        const isAdmin = await checkAdminPermission(req.headers.authorization);
        if (!isAdmin)
            res.status(401).json({detail: 'You do not have such permissions'});
        const {id} = req.params;
        const order = await Order.findOne({
            where: { id: id },
        })
        await order.destroy();
        res.status(204).json({});
    } catch (error) {
        res.status(400).json({detail: 'Cannot delete order'});
    }
}

const updateOrder = async (req, res) => {
    try {
        const isAdmin = await checkAdminPermission(req.headers.authorization);
        if (!isAdmin)
            res.status(401).json({detail: 'You do not have such permissions'});
        const {id} = req.params;
        const {status} = req.body;
        const order = await Order.findOne({
            where: { id: id },
        });
        await order.update({status: status});
        res.status(200).json(order);
    } catch (error) {
        res.status(400).json({detail: 'Cannot update order'});
    }
}



module.exports = {
    getOrders,
    createOrder,
    getOrderPrice,
    deleteOrder,
    updateOrder
}