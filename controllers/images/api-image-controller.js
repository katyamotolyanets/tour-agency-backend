require('dotenv').config();

const Image = require("../../models/images/Image");

const getImages = (req, res) => {
    Image.findAll().then(response => {
        res.status(200).json(response)
    })
}

module.exports = {
    getImages,
}