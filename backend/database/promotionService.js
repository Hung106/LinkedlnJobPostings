const client = require('./database');
const { v4: uuidv4 } = require('uuid')

class PromotionService {
    constructor() { };

    async createPromotion(newPromotion) {
        return new Promise(async (resolve, reject) => {
            const { name, quantity, description, starttime, endtime, minspent, discount_type, value, percentage, max_amount, apply_range, apply_id } = newPromotion;
            try {
                // Kiểm tra nếu chương trình khuyến mãi đã tồn tại
                client.query(`SELECT * FROM promotion WHERE name = $1`, [name], async (err, res) => {
                    if (err) {
                        reject({
                            status: 400,
                            msg: err.message,
                            data: null
                        });
                    } else if (res.rows.length !== 0) {
                        resolve({
                            status: 404,
                            msg: 'The promotion is already exist',
                            data: null
                        });
                    } else {
                        // Đợi getCount hoàn thành trước khi tiếp tục
                        //const promotionId = "PID" + await getCount(); // Đảm bảo getCount trả về một Promise hoặc là một hàm async
                        const promotionId = uuidv4();
                        // Sau khi getCount hoàn tất, tiếp tục thực hiện chèn dữ liệu
                        client.query(
                            `INSERT INTO promotion(promotion_id, name, quantity, description, starttime, endtime, minspent, discount_type, value, percentage, max_amount, apply_range, apply_id) 
                             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
                            [promotionId, name, quantity, description, starttime, endtime, minspent, discount_type, value, percentage, max_amount, apply_range, apply_id],
                            (err, res) => {
                                if (err) {
                                    console.log(err);
                                    reject({
                                        status: 400,
                                        msg: err.message,
                                        data: null
                                    });
                                } else {
                                    resolve({
                                        status: 200,
                                        msg: "Create successfully!",
                                        data: newPromotion
                                    });
                                }
                            }
                        );
                    }
                });
            } catch (err) {
                reject({
                    status: 404,
                    msg: err.message,
                    data: null
                });
            }
        });
    }

    async updatePromotion(id, data) {
        return new Promise(async (resolve, reject) => {
            client.query(`
                SELECT * FROM promotion
                WHERE promotion_id = $1
            `, [id], (err, res) => {
                if (err) {
                    reject({
                        status: 400,
                        msg: err.message,
                        data: null
                    });
                }
                else if (res.rows.length === 0) {
                    resolve({
                        status: 404,
                        msg: 'The id is not exist',
                        data: null
                    });
                }
                else {
                    client.query(`
                        SELECT * FROM promotion WHERE name = $1`, [data.name], async (err, res) => {
                        if (err) {
                            reject({
                                status: 400,
                                msg: err.message,
                                data: null
                            });
                        }
                        else if (res.rows.length !== 0 && res.rows[0].promotion_id !== id) {
                            console.log(res.rows)
                            resolve({
                                status: 404,
                                msg: 'The promotion name is already exist',
                                data: null
                            });
                        }
                        else {
                            try {
                                for (const [key, value] of Object.entries(data)) {
                                    await client.query(`UPDATE promotion SET ${key} = $1 WHERE promotion_id = $2`, [value, id]);
                                }
                                const updatepromotion = await client.query(`SELECT * FROM promotion WHERE promotion_id = $1`, [id])

                                resolve({
                                    status: 200,
                                    msg: 'Update success',
                                    data: updatepromotion.rows[0]
                                });
                            } catch (updateErr) {
                                reject({
                                    status: 400,
                                    msg: updateErr.message,
                                    data: null
                                });
                            }
                        }
                    })
                }
            })
        })
    }

    async deletePromotion(id) {
        return new Promise((resolve, reject) => {
            // Kiểm tra xem sản phẩm có tồn tại không
            client.query(`
            SELECT * FROM promotion WHERE promotion_id = $1
          `, [id], (err, res) => {
                if (err) {
                    reject({
                        status: 400,
                        msg: err.message,
                        data: null
                    });
                } else if (res.rows.length === 0) {
                    resolve({
                        status: 404,
                        msg: "The promotion with the specified ID does not exist",
                        data: null
                    });
                } else {
                    // Nếu sản phẩm tồn tại, thực hiện xóa
                    client.query(`
                DELETE FROM promotion WHERE promotion_id = $1
              `, [id], (deleteErr, deleteRes) => {
                        if (deleteErr) {
                            reject({
                                status: 400,
                                msg: deleteErr.message,
                                data: null
                            });
                        } else {
                            resolve({
                                status: 200,
                                msg: "Promotion deleted successfully",
                                data: null
                            });
                        }
                    });
                }
            });
        });
    }

    async getPromotion(id) {
        return new Promise((resolve, reject) => {
            // Kiểm tra xem sản phẩm có tồn tại không
            client.query(`
              SELECT * FROM promotion WHERE promotion_id = $1
            `, [id], (err, res) => {
                if (err) {
                    reject({
                        status: 400,
                        msg: err.message,
                        data: null
                    });
                } else if (res.rows.length === 0) {
                    resolve({
                        status: 404,
                        msg: "The promotion with the specified ID does not exist",
                        data: null
                    });
                } else {
                    // Nếu sản phẩm tồn tại, thực hiện load lên
                    resolve({
                        status: 200,
                        msg: "Get promotion successfully",
                        data: res.rows[0]
                    });
                }
            });
        });
    }

    async getAll() {
        return new Promise((resolve, reject) => {
            // Kiểm tra xem sản phẩm có tồn tại không
            client.query(`
              SELECT * FROM promotion
            `, (err, res) => {
                if (err) {
                    reject({
                        status: 400,
                        msg: err.message,
                        data: null
                    });
                }
                //   else if (res.rows.length === 0) {
                //     resolve({
                //       status: 404,
                //       msg: "The promotion with the specified ID does not exist",
                //       data: null
                //     });
                //   } 
                else {
                    // Nếu sản phẩm tồn tại, thực hiện load lên
                    //console.log(res.rows.length);
                    resolve({
                        status: 200,
                        msg: "Get all promotion successfully",
                        data: res.rows
                    });
                }
            });
        });
    }
}

module.exports = new PromotionService;