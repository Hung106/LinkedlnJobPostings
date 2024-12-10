const express = require('express');
const router = express.Router();
const orderController = require('../controller/order.Controller');

router.post('/create', orderController.createOrder);


module.exports = router;