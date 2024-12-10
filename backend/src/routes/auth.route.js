const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const authController = require('../controller/auth.Controller');
const authMiddleware = require('../middleware/authMiddleware.js');
//const authOrder = require('../controller/order.Controller.js');

router.post('/login', [
    body('email')
        .trim()
        .isEmail(),
    body('password')
        .trim()
        .isLength({ min: 5 })
        .withMessage('Password mus be  at leat 5 characters long')
], authController.postLogin);


module.exports = router;
