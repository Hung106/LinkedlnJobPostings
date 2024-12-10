const express = require('express');
const router = express.Router();
//const {body, param} = require('express-validator');
const promotionController = require('../controller/promotion.Controller');
const authMiddleware = require('../middleware/authMiddleware.js');


router.post('/CreatePromotion', authMiddleware.authUserMiddleWare, promotionController.createPromotion);
router.put('/UpdatePromotion/:id', authMiddleware.authUserMiddleWare, promotionController.updatePromotion);
router.delete('/DeletePromotion/:id', authMiddleware.authUserMiddleWare, promotionController.deletePromotion);
router.get('/GetPromotion/:id', promotionController.getPromotion);
router.get('/GetAll', promotionController.getAll);

module.exports = router;