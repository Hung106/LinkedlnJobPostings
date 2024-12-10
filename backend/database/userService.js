const { NVarChar } = require('mssql');
const { clientConnect, sql } = require('./database');
const { v4: uuidv4 } = require('uuid');

class UserService {
    constructor() { };

    async findByEmail(email) {
        try {
            console.log('Starting to find user by email:', email); // Log email tìm kiếm

            const client = await clientConnect;

            if (!client) {
                throw new Error('Failed to connect to the database. Client is undefined.');
            }
            const user = await client.request()
                .input('email', sql.NVarChar, email)
                .query(`SELECT * FROM users WHERE email = @email`);

            if (!user.recordset || user.recordset.length === 0) {
                console.log('No user found for email:', email); 
                return {
                    status: 404,
                    msg: 'No user found for the given email',
                    data: null
                };
            }

            return {
                status: 200,
                msg: "Lấy thông tin thành công",
                data: user.recordset[0]
            };
        } catch (err) {
            console.error('Error occurred:', err.message); // Log lỗi nếu có
            return {
                status: 400,
                msg: err.message,
                data: null
            };
        }
    }
}

module.exports = new UserService();
