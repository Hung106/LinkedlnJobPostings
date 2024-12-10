const express = require('express');
const router = express.Router();
//const { body, param } = require('express-validator');
const productController = require('../controller/product.Controller');
const authMiddleware = require('../middleware/authMiddleware');

const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'image/'); // Lưu vào thư mục 'image'
    },
    filename: (req, file, cb) => {
        cb(null, performance.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

router.post('/CreateProduct', productController.createProduct);
router.put('/UpdateProduct', productController.updateProduct);
router.delete('/deleteProduct', productController.deleteProduct);
router.get('/getProduct', productController.getProduct);
router.get('/getProductBySeller', productController.getProductBySeller);

module.exports = router;