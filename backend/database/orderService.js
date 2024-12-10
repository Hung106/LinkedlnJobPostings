const {clientConnect,sql} = require('./database');
const { v4: uuidv4 } = require('uuid')

class OrderService {
    constructor() { };

    async createOrder(customerID, newOrder) {
        const transaction = new sql.Transaction(await clientConnect);
        try {
            await transaction.begin();
            const id = uuidv4();
            const productList = newOrder.list; // Parse nếu `list` là chuỗi JSON
            console.log(productList);
            let sumProducts = 0
            if (!productList || productList.length === 0) {
                return {
                    status: 400,
                    msg: "Không có sản phẩm",
                    data: null
                };
            }
    
            // Thêm vào bảng orders
            await transaction.request()
                .input('order_id', sql.NVarChar, id)
                .input('payment', sql.NVarChar, newOrder.payment_method)
                .input('status', sql.NVarChar, 'pending')
                .input('cid', sql.NVarChar, customerID)
                .input('sid', sql.NVarChar, newOrder.ship || null)
                .query(`INSERT INTO orders VALUES (@order_id, DEFAULT, @payment, @status, @cid, @sid, 0, 0, 0)`);
    
            // Chèn vào bảng includes và cập nhật stock/sold
            for (const item of productList) {
                if (!item.product_id || !item.color || !item.size || !item.quantity || !item.paid_price) {
                    throw new Error("Thông tin sản phẩm không hợp lệ.");
                }
                sumProducts += item.quantity
                await transaction.request()
                    .input('product_id', sql.NVarChar, item.product_id)
                    .input('color', sql.NVarChar, item.color)
                    .input('size', sql.NVarChar, item.size)
                    .input('quantity', sql.Int, item.quantity)
                    .input('paidprice', sql.Int, item.paid_price)
                    .input('order_id', sql.NVarChar, id)
                    .query(`INSERT INTO includes VALUES (@product_id, @color, @size, @order_id, @quantity, @paidprice)`);
    
                // Cập nhật stock và sold
                await transaction.request()
                    .input('product_id', sql.NVarChar, item.product_id)
                    .input('color', sql.NVarChar, item.color)
                    .input('size', sql.NVarChar, item.size)
                    .input('quantity', sql.Int, item.quantity)
                    .query(`UPDATE product_size 
                            SET stock = stock - @quantity, sold = sold + @quantity 
                            WHERE product_id = @product_id AND color = @color AND size = @size`);
            }
            const price = await transaction.request()
                .input('id', sql.NVarChar, id)
                .query(`SELECT dbo.GetTotalAmountToPayForOrder7(@id) AS Final_Price;`);
                console.log(price)
            await transaction.request()
                .input('order_id', sql.NVarChar, id)
                .input('payment', sql.NVarChar, newOrder.payment_method)
                .input('status', sql.NVarChar, 'pending')
                .input('cid', sql.NVarChar, customerID)
                .input('sid', sql.NVarChar, newOrder.ship || null)
                .input('price', sql.Decimal, price.recordset[0].Final_Price)
                .input('sum', sql.Int, sumProducts)
                .query(`UPDATE orders 
                        SET product_numbers = @sum, total_cost = @price, final_price = @price`);
            // Lấy giá trị đơn hàng
            
    
            await transaction.commit();
    
            return {
                status: 200,
                msg: "Tạo đơn thành công",
                data: { price: price.recordset[0].Final_Price, newOrder }
            };
        } catch (err) {
            await transaction.rollback();
            return {
                status: 400,
                msg: err.message,
                data: null
            };
        }
    }
    
    
    async updateOrder(customerID,newOrder) {
        try{
            const client = await clientConnect
            const id = uuidv4()
            const productList = newOrder.list
            console.log(productList)
            if (productList.length === 0){
                return{
                    status: 400,
                    msg: "Không có sản phẩm",
                    data: null
                }
            }
            await client.request()
                .input('order_id', sql.NVarChar, id)
                .input('payment', sql.NVarChar, newOrder.payment_method)
                .input('status', sql.NVarChar, 'pending')
                .input('cid', sql.NVarChar, customerID)
                .input('sid', sql.NVarChar, newOrder.ship)
                .query(`UPDATE orders
                        SET payment = @payment, status = @status, cid = @cid, sid = @sid
                        WHERE order_id = @order_id
                `)
                for (let i = 0; i< productList.length; i++){
                    const item = productList[i]
                    console.log(item)
                    await client.request()
                        .input('product_id', sql.NVarChar, item.product_id)
                        .input('color', sql.NVarChar, item.color)
                        .input('size', sql.NVarChar, item.size)
                        .input('quantity', sql.Int, item.quantity)
                        .input('paidprice', sql.Int, item.paid_price)
                        .input('order_id', sql.NVarChar, id)
                        .query(`
                            UPDATE includes
                            SET color = @color, size = @size, order_id = @order_id, quantity = @quantity, paidprice = @paidprice
                            WHERE product_id = @product_id
                        `)
                    await client.request()
                        .input('product_id', sql.NVarChar, item.product_id)
                        .input('color', sql.NVarChar, item.color)
                        .input('size', sql.NVarChar, item.size)
                        .input('quantity', sql.Int, item.quantity)
                        .query(`UPDATE product_size SET stock = stock - @quantity, sold = sold + @quantity 
                                WHERE product_id = @product_id AND color = @color AND size = @size`)
            }

            
            const price = await client.request()
                            .input('id', sql.NVarChar,id )
                            .query(`SELECT dbo.GetTotalAmountToPayForOrder7(@id) As Final_Price;`)
            await client.request()
            .input('order_id', sql.NVarChar, id)
            .input('payment', sql.NVarChar, newOrder.payment_method)
            .input('status', sql.NVarChar, 'pending')
            .input('cid', sql.NVarChar, customerID)
            .input('price', sql.Decimal, price)
            .query(`UPDATE orders
                    SET total_price = @price, final_price = @price
                    WHERE order_id = @order_id
            `)
            return {
                status: 200,
                msg: "Cập nhật đơn thành công",
                data: { price, newOrder}
            }
        }
        catch(err){
            return {
                status:400,
                msg: err.message,
                data: null
            }
        }
    }
}

module.exports = new OrderService;