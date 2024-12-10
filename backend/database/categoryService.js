const client = require('./database')
const { v4: uuidv4 } = require('uuid')

class CategoryService {

    async countProducts(categoryName) {
        return new Promise((resolve, reject) => {
            client.query(`SELECT COUNT(*) AS total FROM product WHERE cate_id =$1`, [categoryName], (err, res) => {
                if (err) {
                    reject({
                        status: 400,
                        msg: err.message,
                        data: null
                    });
                } else {
                    resolve({
                        status: 200,
                        msg: 'COUNT SUCCESS',
                        data: res.rows[0].total
                    });
                }
            });
        });
    }

    async sortProducts(sort, limit, offset, categoryId) {
        return new Promise((resolve, reject) => {
            const allowedColumns = ['product_id', 'pname', 'price', 'brand', 'quantity', 'cate_id', 'create_time', 'rating', 'sold']
            let order = 'ASC';
            let column = 'product_id';

            if (Array.isArray(sort)) {
                const upperSort0 = sort[0].toUpperCase();
                const upperSort1 = sort[1].toUpperCase();

                if (upperSort0 === 'ASC' || upperSort0 === 'DESC') {
                    order = upperSort0;
                    if (allowedColumns.includes(sort[1])) {
                        column = sort[1];
                    }
                } else if (upperSort1 === 'ASC' || upperSort1 === 'DESC') {
                    order = upperSort1;
                    if (allowedColumns.includes(sort[0])) {
                        column = sort[0];
                    }
                }
            } else if (typeof (sort) === "string") {
                if (allowedColumns.includes(sort)) {
                    column = sort;
                }
                else if (sort.toUpperCase() === 'ASC' || sort.toUpperCase() === 'DESC') {
                    order = sort.toUpperCase()
                }
            }
            client.query(
                `SELECT * FROM product WHERE cate_id = $1 ORDER BY ${column} ${order} LIMIT $2 OFFSET $3`,
                [categoryId, limit, offset],
                (err, res) => {
                    if (err) {
                        reject({
                            status: 400,
                            msg: err.message,
                            data: null
                        });
                    } else {
                        resolve({
                            status: 200,
                            msg: 'SORT SUCCESS',
                            data: res.rows
                        });
                    }
                }
            );
        });
    }

    async getOneCategory(limit, page, sort, categoryName) {
        return new Promise(async (resolve, reject) => {
            try {
                client.query(`SELECT * FROM category WHERE cate_name = $1`, [categoryName], async (errCate, resCate) => {
                    if (errCate) {
                        reject({
                            status: 400,
                            msg: errCate.message,
                            data: null
                        });
                    } else if (resCate.rowCount === 0) {
                        reject({
                            status: 404,
                            msg: 'The cate_name is not exist',
                            data: null
                        });
                    }
                    else {
                        let countPro = await this.countProducts(resCate.rows[0].cate_id)
                        if (sort) {
                            const products = await this.sortProducts(sort, limit, limit * page, resCate.rows[0].cate_id)
                            resolve({
                                status: 200,
                                msg: 'SUCCESS',
                                data: products.data,
                                totalProduct: countPro.data,
                                currentPage: page + 1,
                                totalPage: Math.ceil(countPro.data / limit)
                            });
                        }
                        client.query(
                            `SELECT * FROM product WHERE cate_id = $1 LIMIT $2 OFFSET $3`,
                            [resCate.rows[0].cate_id, limit, limit * page],
                            (errPro, resPro) => {
                                if (errPro) {
                                    reject({
                                        status: 400,
                                        msg: errPro.message,
                                        data: null
                                    });
                                } else {
                                    resolve({
                                        status: 200,
                                        msg: 'SUCCESS',
                                        data: resPro.rows,
                                        totalProduct: countPro.data,
                                        currentPage: page + 1,
                                        totalPage: Math.ceil(countPro.data / limit)
                                    });
                                }
                            }
                        );
                    }
                })

            }

            catch (err) {
                reject(err)
            }
        })
    }
    async getAllCategory() {
        return new Promise((resolve, reject) => {
            client.query(`
                SELECT * FROM category
            `, (err, res) => {
                if (err) {
                    reject({
                        status: 400,
                        msg: err.message,
                        data: null
                    });
                }
                else {
                    resolve({
                        status: 200,
                        msg: 'All category',
                        data: res.rows
                    });
                }
            })
        }
        )
    }

}

module.exports = new CategoryService;