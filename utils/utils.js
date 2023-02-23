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

const checkFieldsValidation = async (req) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let errorMessages = [];
        await errors.errors.forEach(({param, msg}) => {
            let result = {};
            result[param] = msg;
            errorMessages.push(result);
        })
        return errorMessages
    }
}

const checkAdminPermission = async (header) => {
    const accessToken = await getTokenFromAuthorizationHeader(header);
    const {user} = await jwt.decode(accessToken, JWT_ACCESS_SECRET_KEY);
    if (!user.is_manager)
        return false
    return true
}

const getImagesArray = (images) => {
    return images.map(({image}) => {
        return 'http://localhost:5000/media/' + image
    })
}

module.exports = {
    getUserFromToken,
    getTokenFromAuthorizationHeader,
    getOrderPrice,
    checkFieldsValidation,
    checkAdminPermission,
    getImagesArray
}