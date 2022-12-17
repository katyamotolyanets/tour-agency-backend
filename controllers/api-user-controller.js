require('dotenv').config();
const bcrypt = require('bcryptjs');
const {validationResult} = require('express-validator')
const jwt = require('jsonwebtoken')

const User = require("../models/User");
const Order = require("../models/Order");
const ArrivalDate = require("../models/ArrivalDate");
const Tour = require("../models/Tour");
const TourFeature = require("../models/TourFeature");
const Hotel = require("../models/Hotel");
const Destination = require("../models/locations/Destination");
const RoomType = require("../models/RoomType");
const {getTokenFromAuthorizationHeader, getUserFromToken} = require("../utils/utils");


const {JWT_ACCESS_SECRET_KEY, JWT_REFRESH_SECRET_KEY, ACCESS_TOKEN_LIFE_TIME, REFRESH_TOKEN_LIFE_TIME} = process.env

const getUsers = (req, res) => {
    User.findAll().then(response => {
        res.status(200).json(response)
    })
}

const getUserInfoByToken = async (req, res) => {
    try {
        const accessToken = getTokenFromAuthorizationHeader(req.headers.authorization);
        let user = getUserFromToken(accessToken);
        User.findOne({
            attributes: [
                'id',
                'email',
                'is_staff',
                'is_manager',
            ],
            where: {
                id: user.id,
            },
            include: {
                model: Order,
                attributes: ['id'],
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
                }
            }
        }).then(({dataValues}) => {
            if (dataValues?.orders?.length > 0) {
                let destinations = [];
                let totalDays = 0;
                let min_price = 0;
                const tourPrice = dataValues.orders.arrival_date.tour.dataValues.price;
                dataValues.orders?.arrival_date.tour.features
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

                dataValues.orders.arrival_date.dataValues.tour.dataValues.destinations = destinations;
                dataValues.orders.arrival_date.dataValues.tour.dataValues.days = totalDays;
                dataValues.orders.arrival_date.dataValues.tour.dataValues.min_price = min_price + Number(tourPrice);

                delete dataValues.orders.arrival_date.dataValues.tour.dataValues.features
                delete dataValues.orders.arrival_date.dataValues.tour.dataValues.price
            }
            res.status(200).json(dataValues)
        })
    } catch (error) {
        res.status(404).json({message: 'Cannot find user with that id :('})
    }
}

const registerUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let errorMessages = [];
            errors.errors.forEach(({param, msg}) => {
                let result = {};
                result[param] = msg;
                errorMessages.push(result);
            })
            return res.status(400).json(errorMessages)
        }
        const {email, password} = req.body;
        const isUserExists = await User.findOne({
            where: {
                email: email,
            }
        });
        if (isUserExists) {
            return res.status(404).json({message: 'User with that email already exists'})
        } else {
            const hashPassword = bcrypt.hashSync(password.toString(), 3);
            const user = await User.create({email, password: hashPassword});
            await user.save();
            return res.status(200).json({id: user.id, email: user.email, password: user.password})
        }
    } catch (error) {
        res.status(404).json({message: 'Cannot register user!'})
    }
}

const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({
            where: {
                email: email,
            }
        })
        const isValidPassword = bcrypt.compareSync(password, user.password);
        if (!user || !isValidPassword) {
            res.status(400).json({detail: 'No active account found with the given credentials'})
        }
        const token = jwt.sign({user: user}, JWT_ACCESS_SECRET_KEY, {expiresIn: ACCESS_TOKEN_LIFE_TIME});
        const refreshToken = jwt.sign({user: user}, JWT_REFRESH_SECRET_KEY, {expiresIn: REFRESH_TOKEN_LIFE_TIME})
        return res.status(200).json({access: token, refresh: refreshToken})
    } catch (error) {
        res.status(400).json({message: 'Login error'})
    }
}

const refreshToken = async (req, res) => {
    try {
        const {refresh} = req.body;
        jwt.verify(refresh, JWT_REFRESH_SECRET_KEY, (error, decoded) => {
            if (error) {
                res.status(401).json({detail: 'Token is invalid or expired'})
            } else {
                const token = jwt.sign({user: decoded.user}, JWT_ACCESS_SECRET_KEY,
                    {expiresIn: ACCESS_TOKEN_LIFE_TIME});
                res.status(200).json({access: token});
            }
        });
    } catch (error) {
        res.status(400).json({message: 'Refresh error'})
    }
}

const verifyToken = async (req, res) => {
    try {
        const {token} = req.body;
        return jwt.verify(token, JWT_ACCESS_SECRET_KEY, (error) => {
            if (error)
                res.status(401).json({detail: 'Token is invalid or expired'})
            res.status(200).json({});
        });
    } catch (error) {
        res.status(401).json({detail: 'Cannot verify token'})
    }
}

const checkAdminPermissions = async (req, res) => {
    const accessToken = await getTokenFromAuthorizationHeader(req.headers.authorization);
    try {
        const {user} = await jwt.decode(accessToken, JWT_ACCESS_SECRET_KEY);
        res.status(200).json(user.is_manager);
    } catch (error) {
        res.status(401).json({detail: 'Unauthorized'});
    }
}

module.exports = {
    getUsers,
    getUserInfoByToken,
    registerUser,
    loginUser,
    verifyToken,
    refreshToken,
    checkAdminPermissions
}