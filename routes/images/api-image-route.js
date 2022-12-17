const express = require('express')
const router = express.Router()

const {
    getImages,
} = require('../../controllers/images/api-image-controller')

router.get('/api/images', getImages);

module.exports = router