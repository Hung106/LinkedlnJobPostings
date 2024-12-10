const OrderService = require('../../database/orderService');

class OrderController {
    async createOrder(req, res){
        try{
            const order = await OrderService.createOrder(req.query.customer_id, req.body)
            return res.status(200).json(order)
        }
        catch(err){
            return res.status(400).json({
                status: 400,
                msg: "Tạo đơn thất bại",
                data: null
            })
        }
    }
}

module.exports = new OrderController;