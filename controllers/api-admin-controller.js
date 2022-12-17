import jwt from "jsonwebtoken";

const {getTokenFromAuthorizationHeader} = require("../utils/utils");
const {getUserFromToken} = require("../utils/utils");
require('dotenv').config();

const {JWT_ACCESS_SECRET_KEY} = process.env;

const deleteOrder = async (req, res) => {
    const accessToken = await getTokenFromAuthorizationHeader(req.headers.authorization);
    const {user} = await jwt.decode(accessToken, JWT_ACCESS_SECRET_KEY);
    if (!user.is_manager)
        res.status(401).json({detail: 'Unauthorized'});
}

module.exports = {
    getHotels,
}