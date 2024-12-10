const express = require('express');
const router = express.Router();
const {body, param} = require('express-validator');
const productController = require('../controller/product.Controller');
const AdminService = require('../../database/adminService');

router.get('/app/data',productController.fetchAllProducts);

module.exports = router;