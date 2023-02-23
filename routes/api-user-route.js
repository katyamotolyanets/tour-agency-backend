const express = require('express');
const User = require("../models/User");
const Order = require("../models/Order");
const {check} = require("express-validator");
const { validator } = require('express-validator');

const router = express.Router();

const {
    getUsers,
    getUserInfoByToken,
    registerUser,
    loginUser,
    verifyToken,
    refreshToken,
    checkAdminPermissions
} = require('../controllers/api-user-controller');

User.hasMany(Order, {foreignKey: 'user_id'})

router.get('/api/users', getUsers);

router.post('/api/users/', [
    check('email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Enter a valid email address'),
    check('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({min: 8})
        .withMessage('Ensure password has at least 8 characters')
], registerUser);

router.get('/api/users/my/', getUserInfoByToken);

router.post('/api/users/is-admin/', checkAdminPermissions);

router.post('/login/', [
    check('email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Enter a valid email address'),
    check('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({min: 8})
        .withMessage('Ensure password has at least 8 characters')
], loginUser);

router.post('/token-verify/', [
    check('token')
        .notEmpty()
], verifyToken);

router.post('/refresh-token/', [
    check('refresh')
        .notEmpty()
], refreshToken);



module.exports = router