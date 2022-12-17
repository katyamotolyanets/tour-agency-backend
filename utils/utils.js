const jwt = require('jsonwebtoken')
const {validationResult} = require("express-validator");

const {JWT_ACCESS_SECRET_KEY} = process.env;

const getUserFromToken = async token => {
    await jwt.verify(token, JWT_ACCESS_SECRET_KEY, (error, decoded) => {
        if (error) return false;
        return decoded.user;
    });
}

const getTokenFromAuthorizationHeader = async header => {
    return await header.split('Bearer ')[1];
}

const getOrderPrice = (arrival_date, count_tickets, order_rooms) => {
    let price = (arrival_date?.tour?.price - arrival_date.discount) * count_tickets;
    for (let order_room in order_rooms) {
        price += order_room["room"].cost_per_day * order_room["feature"].days;
    }
    return price
}

const checkFieldsValidation = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let errorMessages = [];
        await errors.errors.forEach(({param, msg}) => {
            let result = {};
            result[param] = msg;
            errorMessages.push(result);
        })
        return res.status(400).json(errorMessages)
    }
}

module.exports = {
    getUserFromToken,
    getTokenFromAuthorizationHeader,
    getOrderPrice,
    checkFieldsValidation
}