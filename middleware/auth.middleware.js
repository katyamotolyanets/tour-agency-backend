require('dotenv').config();
const jwt = require('jsonwebtoken')

const {JWT_ACCESS_SECRET_KEY} = process.env

module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next()
    }

    try {
        const token = req.headers.authorization.split(' ')[1]
        if (!token) {
            return res.status(401).json({message: 'Authorization error'})
        }
        const decoded = jwt.verify(token, JWT_ACCESS_SECRET_KEY)
        req.user = decoded
        next()
    } catch (error) {
        return res.status(401).json({message: 'Authorization error'})
    }

}
