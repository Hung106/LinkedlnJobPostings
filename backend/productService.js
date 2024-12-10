const { NVarChar } = require('mssql');
const { clientConnect, sql } = require('./database');
const { v4: uuidv4 } = require('uuid');

class ProductService {
    async createProduct(newProduct) {
        try {
            const { url, title, brand, description, breadcrumb, seller_id, category_id, color, size, stock, initial_price, final_price, sold } = newProduct;
            const client = await clientConnect
            // Kiểm tra sản phẩm đã tồn tại chưa
            const result = await client.request()
                .input('title', sql.NVarChar, title)
                .query('SELECT * FROM products WHERE title = @title');

            if (result.recordset.length !== 0) {
                const existingProduct = result.recordset[0];
                const checkColor = await client.request()
                    .input('color', sql.NVarChar, color)
                    .query('SELECT * FROM product_color WHERE color = @color');

                if (checkColor.recordset.length !== 0) {
                    // If color exists, check size
                    const checkSize = await client.request()
                        .input('size', sql.NVarChar, size)
                        .query('SELECT * FROM product_size WHERE size = @size');

                    if (checkSize.recordset.length !== 0) {
                        // Update existing product if size exists
                        await client.request()
                            .input('product_id', sql.NVarChar, existingProduct.product_id)
                            .input('url', sql.NVarChar, url)
                            .input('title', sql.NVarChar, title)
                            .input('brand', sql.NVarChar, brand)
                            .input('description', sql.Text, description)
                            .input('breadcrumb', sql.Text, breadcrumb)
                            .input('seller_id', sql.NVarChar, seller_id)
                            .input('category_id', sql.NVarChar, category_id)
                            .input('color', sql.NVarChar, color)
                            .input('size', sql.NVarChar, size)
                            .input('sold', sql.Int, sold + checkSize.recordset[0].sold) // Add existing sold to new sold
                            .input('stock', sql.Int, stock + checkSize.recordset[0].stock) // Add existing stock to new stock
                            .input('i_price', sql.Decimal, initial_price)
                            .input('f_price', sql.Decimal, final_price)
                            .query(`
                                EXEC UpdateProduct 
                                    @p_product_id = @product_id, 
                                    @p_url = @url, 
                                    @p_title = @title, 
                                    @p_brand = @brand, 
                                    @p_description = @description, 
                                    @p_breadcrumb = @breadcrumb, 
                                    @p_seller_id = @seller_id, 
                                    @p_category_id = @category_id, 
                                    @p_color = @color, 
                                    @p_size = @size, 
                                    @p_sold = @sold, 
                                    @p_stock = @stock, 
                                    @p_intitial_price = @i_price,
                                    @p_final_price = @f_price;
                            `);
                        return {
                            status: 200,
                            msg: "Sản phẩm đã tồn tại. Thực hiện cập nhật.",
                            data: { product_id: existingProduct.product_id, newProduct }
                        };
                    } else {
                        // If size does not exist, add size to product
                        await client.request()
                            .input('product_id', sql.NVarChar, existingProduct.product_id)
                            .input('color', sql.NVarChar, color)
                            .input('size', sql.NVarChar, size)
                            .input('sold', sql.Int, sold)
                            .input('stock', sql.Int, stock)
                            .input('i_price', sql.Decimal, initial_price)
                            .input('f_price', sql.Decimal, final_price)
                            .query(`
                                INSERT INTO product_size 
                                VALUES(@product_id, @color, @size, @sold, @stock, @i_price, @f_price);
                            `);
                        return {
                            status: 200,
                            msg: "Thêm kích thước cho sản phẩm",
                            data: { product_id: existingProduct.product_id, newProduct }
                        };
                    }
                } else {
                    // If color doesn't exist, add color and size to product
                    await client.request()
                        .input('product_id', sql.NVarChar, existingProduct.product_id)
                        .input('color', sql.NVarChar, color)
                        .query(`
                            INSERT INTO product_color VALUES(@product_id, @color);
                        `);
                    await client.request()
                        .input('product_id', sql.NVarChar, existingProduct.product_id)
                        .input('color', sql.NVarChar, color)
                        .input('size', sql.NVarChar, size)
                        .input('sold', sql.Int, sold)
                        .input('stock', sql.Int, stock)
                        .input('i_price', sql.Decimal, initial_price)
                        .input('f_price', sql.Decimal, final_price)
                        .query(`
                            INSERT INTO product_size 
                            VALUES(@product_id, @color, @size, @sold, @stock, @i_price, @f_price);
                        `);
                    return {
                        status: 200,
                        msg: "Thêm màu và kích thước cho sản phẩm",
                        data: { product_id: existingProduct.product_id, newProduct }
                    };
                }
            } else {
                // If product does not exist, create new product
                const product_id = uuidv4();
                await client.request()
                    .input('product_id', sql.NVarChar, product_id)
                    .input('url', sql.NVarChar, url)
                    .input('title', sql.NVarChar, title)
                    .input('brand', sql.NVarChar, brand)
                    .input('description', sql.Text, description)
                    .input('breadcrumb', sql.Text, breadcrumb)
                    .input('seller_id', sql.NVarChar, seller_id)
                    .input('category_id', sql.NVarChar, category_id)
                    .input('color', sql.NVarChar, color)
                    .input('size', sql.NVarChar, size)
                    .input('sold', sql.Int, sold)
                    .input('stock', sql.Int, stock)
                    .input('i_price', sql.Decimal, initial_price)
                    .input('f_price', sql.Decimal, final_price)
                    .query(`
                        EXEC InsertProduct 
                            @p_product_id = @product_id, 
                            @p_url = @url, 
                            @p_title = @title, 
                            @p_brand = @brand, 
                            @p_description = @description, 
                            @p_breadcrumb = @breadcrumb, 
                            @p_seller_id = @seller_id, 
                            @p_category_id = @category_id, 
                            @p_color = @color, 
                            @p_size = @size, 
                            @p_sold = @sold, 
                            @p_stock = @stock, 
                            @p_intitial_price = @i_price,
                            @p_final_price = @f_price;
                    `);
                return {
                    status: 200,
                    msg: "Thêm mới sản phẩm",
                    data: { product_id, newProduct }
                };
            }
        } catch (err) {
            console.error(err);
            return {
                status: 400,
                msg: err.message,
                data: null
            };
        }
    }

    async updateProduct(id,newProduct) {
        try {
            const { url, title, brand, description, breadcrumb, seller_id, category_id, color, size, stock, initial_price, final_price, sold } = newProduct;
            const client = await clientConnect
            await client.request()
                .input('product_id', sql.NVarChar, id)
                .input('url', sql.NVarChar, url)
                .input('title', sql.NVarChar, title)
                .input('brand', sql.NVarChar, brand)
                .input('description', sql.Text, description)
                .input('breadcrumb', sql.Text, breadcrumb)
                .input('seller_id', sql.NVarChar, seller_id)
                .input('category_id', sql.NVarChar, category_id)
                .input('color', sql.NVarChar, color)
                .input('size', sql.NVarChar, size)
                .input('sold', sql.Int, sold) // Add existing sold to new sold
                .input('stock', sql.Int, stock) // Add existing stock to new stock
                .input('i_price', sql.Decimal, initial_price)
                .input('f_price', sql.Decimal, final_price)
                .query(`
                    EXEC UpdateProduct 
                        @p_product_id = @product_id, 
                        @p_url = @url, 
                        @p_title = @title, 
                        @p_brand = @brand, 
                        @p_description = @description, 
                        @p_breadcrumb = @breadcrumb, 
                        @p_seller_id = @seller_id, 
                        @p_category_id = @category_id, 
                        @p_color = @color, 
                        @p_size = @size, 
                        @p_sold = @sold, 
                        @p_stock = @stock, 
                        @p_intitial_price = @i_price,
                        @p_final_price = @f_price;
                `);
        return {
            status: 200,
            msg: "Sản phẩm đã tồn tại. Thực hiện cập nhật.",
            data: { product_id: id, newProduct }
        };
        } catch (err) {
            console.error(err);
            return {
                status: 400,
                msg: err.message,
                data: null
            };
        }
    }

    async getProduct(filter){
        try{
            const client = await clientConnect
            let query = 'SELECT * FROM products'
            let feature =""
            if (filter.product_id){
                query += ' WHERE product_id = @pid'
            }

            if (filter.product_id && filter.title){
                query += ' AND title = @title'
            }
            else if(filter.title){
                query += ' WHERE title = @title'
            }

            if(filter.title && filter.filter){
                feature = "%" + filter.filter + "%"
                query += ' AND breadcrumb LIKE @feature'
            }
            else if(filter.filter){
                feature = "%" + filter.filter + "%"
                query += ' WHERE breadcrumb LIKE @feature'
            }
            const product = await client.request()
                            .input('pid', sql.NVarChar, filter.product_id)
                            .input('title', sql.NVarChar, filter.title)
                            .input('feature', sql.Text, feature)
                            .query(query)
                            return {
                                status: 200,
                                msg: "Lấy sản phẩm thành công",
                                data: product.recordset
                            };
            
        }
        catch(err){
            return {
                status: 400,
                msg: err.message,
                data: null
            };
        }
    }

    async deleteProduct(id){
        try{
            const client = await clientConnect
            await client.request()
                .input('id', sql.NVarChar, id)
                .query(`
                    DELETE FROM product_size WHERE product_id = @id;
                    DELETE FROM product_color WHERE product_id = @id;
                    DELETE FROM products WHERE product_id = @id`)
                return {
                    status: 200,
                    msg: "Xóa sản phẩm thành công",
                    data: null
                };
        }
        catch(e){
            return {
                status: 400,
                msg: e.message,
                data: null
            };
        }
    }
}

module.exports = new ProductService();
