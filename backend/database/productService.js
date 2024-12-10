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
            const checkProd = await client.request()
                .input('product_id', sql.NVarChar, id)
                .input('seller_id', sql.NVarChar, seller_id)
                .query(`SELECT * FROM products WHERE product_id = @product_id AND seller_id = @seller_id`)
            if (checkProd.recordset === 0) 
                return{
                    status: 400,
                    msg: "Cửa hàng không có mặt hàng này",
                    data: null
                }
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
            let query = 'SELECT TOP 100 * FROM products AS p JOIN categories as c ON p.category_id = c.category_id JOIN product_color AS pc ON pc.product_id = p.product_id JOIN product_size AS ps ON ps.product_id = p.product_id'

            let feature =""
            let likeTitle = ''
            if (filter.product_id){
                query += ' WHERE product_id = @pid'
            }

            if (filter.product_id && filter.title){
                likeTitle = '%' + filter.title +'%'
                query += ' AND title like @likeTitle'
            }
            else if(filter.title){
                likeTitle = '%' + filter.title +'%'
                query += ' WHERE title LIKE @likeTitle'
            }

            if(filter.title && filter.filter){
                feature = "%" + filter.filter + "%"
                query += ' AND breadcrumb LIKE @feature'
            }
            else if(filter.filter){
                feature = "%" + filter.filter + "%"
                query += ' WHERE breadcrumb LIKE @feature'
            }

            if( (filter.filter || filter.title || filter.product_id)  && filter.category){
                query += ' AND name = @category'
            }
            else if (filter.category){
                query += ' WHERE name = @category'
            }

            if( (filter.filter || filter.title || filter.product_id ||filter.category)&& filter.minPrice){
                query += ' AND final_price >= @min'
            }
            else if (filter.minPrice){
                query += ' WHERE final_price >= @min'
            }

            if( (filter.filter || filter.title || filter.product_id ||filter.category|| filter.minPrice) && filter.maxPrice){
                query += ' AND final_price <= @max'
            }
            else if (filter.maxPrice){
                query += ' WHERE final_price <= @max'
            }

            if( (filter.filter || filter.title || filter.product_id ||filter.category|| filter.minPrice|| filter.maxPrice) && filter.maxRate){
                query += ' AND rating_average <= @maxrate'
            }
            else if (filter.maxRate){
                query += ' WHERE rating_average <= @maxrate'
            }

            if( (filter.filter || filter.title || filter.product_id ||filter.category|| filter.minPrice|| filter.maxPrice || filter.maxRate) && filter.minRate){
                query += ' AND rating_average >= @minrate'
            }
            else if (filter.minRate){
                query += ' WHERE rating_average >= @minrate'
            }

            if (filter.sprice == 'asc'){
                query += ' ORDER BY final_price ASC'
            }
            else if (filter.sprice == 'desc'){
                query += ' ORDER BY final_price DESC'
            }

            if (!filter.sprice &&filter.ssold == 'asc'){
                query += ' ORDER BY sold ASC'
            }
            else if (!filter.sprice && filter.ssold == 'desc'){
                query += ' ORDER BY sold DESC'
            }

            if ( !filter.sprice && !filter.ssold && filter.srate == 'asc'){
                query += ' ORDER BY rating_average ASC'
            }
            else if (!filter.sprice && !filter.ssold &&  filter.srate == 'desc'){
                query += ' ORDER BY rating_average DESC'
            }
            console.log(query)
            const product = await client.request()
                            .input('pid', sql.NVarChar, filter.product_id)
                            .input('likeTitle', sql.NVarChar, likeTitle)
                            .input('feature', sql.Text, feature)
                            .input('category', sql.NVarChar, filter.category)
                            .input('min', sql.Decimal, filter.minPrice)
                            .input('max', sql.Decimal, filter.maxPrice)
                            .input('minrate', sql.Float, filter.minRate)
                            .input('maxrate', sql.Float, filter.maxRate)
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

    async getProductBySeller(filter){
        try{
            const client = await clientConnect
            let query = 'SELECT TOP 100 * FROM products AS p JOIN categories as c ON p.category_id = c.category_id JOIN product_color AS pc ON pc.product_id = p.product_id JOIN product_size AS ps ON ps.product_id = p.product_id'
            if(filter.seller_id){
                query += ' WHERE seller_id = @seller_id'
            }
            else {
                return {
                    status: 400,
                    msg: "Vui lòng đăng nhập",
                    data: null
                }
            }

            let feature =""
            let likeTitle = ''
            if (filter.product_id){
                query += ' AND product_id = @pid'
            }

            if (filter.title){
                likeTitle = '%' + filter.title +'%'
                query += ' AND title like @likeTitle'
            }

            if(filter.filter){
                feature = "%" + filter.filter + "%"
                query += ' AND breadcrumb LIKE @feature'
            }

            if(filter.category){
                query += ' AND name = @category'
            }

            if(filter.minPrice){
                query += ' AND final_price >= @min'
            }

            if(filter.maxPrice){
                query += ' AND final_price <= @max'
            }

            if(filter.maxRate){
                query += ' AND rating_average <= @maxrate'
            }

            if(filter.minRate){
                query += ' AND rating_average >= @minrate'
            }

            if (filter.sprice == 'asc'){
                query += ' ORDER BY final_price ASC'
            }
            else if (filter.sprice == 'desc'){
                query += ' ORDER BY final_price DESC'
            }

            if (!filter.sprice &&filter.ssold == 'asc'){
                query += ' ORDER BY sold ASC'
            }
            else if (!filter.sprice && filter.ssold == 'desc'){
                query += ' ORDER BY sold DESC'
            }

            if ( !filter.sprice && !filter.ssold && filter.srate == 'asc'){
                query += ' ORDER BY rating_average ASC'
            }
            else if (!filter.sprice && !filter.ssold &&  filter.srate == 'desc'){
                query += ' ORDER BY rating_average DESC'
            }
            console.log(query)
            const product = await client.request()
                            .input('seller_id', sql.NVarChar, filter.seller_id)
                            .input('pid', sql.NVarChar, filter.product_id)
                            .input('likeTitle', sql.NVarChar, likeTitle)
                            .input('feature', sql.Text, feature)
                            .input('category', sql.NVarChar, filter.category)
                            .input('min', sql.Decimal, filter.minPrice)
                            .input('max', sql.Decimal, filter.maxPrice)
                            .input('minrate', sql.Float, filter.minRate)
                            .input('maxrate', sql.Float, filter.maxRate)
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

    async deleteProduct(seller_id,id){
        try{
            const client = await clientConnect
            const checkProd = await client.request()
                .input('product_id', sql.NVarChar, id)
                .input('seller_id', sql.NVarChar, seller_id)
                .query(`SELECT * FROM products WHERE product_id = @product_id AND seller_id = @seller_id`)
            if (checkProd.recordset === 0) 
                return{
                    status: 400,
                    msg: "Cửa hàng không có mặt hàng này",
                    data: null
                }
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
