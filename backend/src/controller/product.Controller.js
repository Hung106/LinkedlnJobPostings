const ProductService = require('../../database/productService');

class ProductController {
    async createProduct(req, res) {
        try {
            const response = await ProductService.createProduct(req.body)
            return res.status(200).json(response)
        }
        catch (err) {
            return res.status(404).json({
                status: 404,
                msg: err,
                data: null
            })
        }
    }

    async updateProduct(req, res) {
        try {
            const response = await ProductService.updateProduct(req.query.product_id,req.body)
            return res.status(200).json(response)
        }
        catch (err) {
            return res.status(404).json({
                status: 404,
                msg: err,
                data: null
            })
        }
    }

    async getProduct(req, res) {
        try {
            const response = await ProductService.getProduct(req.query)
            return res.status(200).json(response)
        }
        catch (err) {
            return res.status(404).json({
                status: 404,
                msg: err,
                data: null
            })
        }
    }

    async getProductBySeller(req, res) {
        try {
            const response = await ProductService.getProductBySeller(req.query)
            return res.status(200).json(response)
        }
        catch (err) {
            return res.status(404).json({
                status: 404,
                msg: err,
                data: null
            })
        }
    }

    async deleteProduct(req,res){
        try {
            const response = await ProductService.deleteProduct(req.query.seller_id,req.query.product_id)
            return res.status(200).json(response)
        }
        catch (err) {
            return res.status(404).json({
                status: 404,
                msg: err,
                data: null
            })
        }
    }

    async createOrder(req,res){
        try{
            const order = await ProductService.createOrder()
            return res.status(200).json(order)
        }
        catch(err){
            return res.status(400).json({
                status: 400,
                msg:"Lỗi khi tạo đơn hàng",
                data: null
            })
        }
    }
}

module.exports = new ProductController;