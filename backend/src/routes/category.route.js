const express = require('express');
const router = express.Router();
const categoryController = require('../controller/category.Controller');


router.get('/getOneCategory', categoryController.getOneCategory);
router.get('/getAll', categoryController.getAllCategory);


module.exports = router;