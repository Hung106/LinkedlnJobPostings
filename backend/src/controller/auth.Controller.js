//const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const UserService = require('../../database/userService');
const {clientConnect, sql} = require('../../database/database')
class AuthController {

async postLogin(req, res) {
    const email = req.body.email;
    const password = req.body.password;
    console.log(email)
    try {
        // Check if the email exists in the database
        const loadedUser = await UserService.findByEmail(email)
        console.log('SQL Query:', `SELECT * FROM users WHERE email = @email`);
        console.log(loadedUser)
        if (loadedUser.status !== 200) {
            const error = new Error('Wrong email');
            error.statusCode = 401;
            error.msg = 'Wrong email';
            error.data = null;
            throw error;
        }

        if (password != loadedUser.data.password) {
            const error = new Error('Wrong password');
            error.statusCode = 401;
            error.msg = 'Wrong password';
            error.data = null;
            throw error;
        }
        console.log(password)
        // Create a JWT token
        const token = jwt.sign(
            {
                userId: loadedUser.user_id,
                userType: loadedUser.user_type,
                email: loadedUser.email,
            },
            process.env.SECRET_TOKEN,
            { expiresIn: '1h' }
        );

        // Send the token as a cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',  // Only enable secure cookies in production
            maxAge: 3600000  // 1 hour
        });

        // Respond with success
        res.status(200).json({
            status: 200,
            msg: 'Authentication successful',
            data: { loadedUser: loadedUser.data,token: token }
        });
    } catch (err) {
        res.status(err.statusCode || 500).json({
            status: err.statusCode || 500,
            msg: err.msg || 'An error occurred',
            data: err.data || null
        });
    }
}


    async fetchAllUsers(req, res) {
        try {
            const { limit, page, filter, sort } = req.query
            const response = await UserService.fetchUsers(Number(limit) || 5, Number(page) || 0, filter, sort)
            return res.status(200).json(response)
        }
        catch (err) {
            return res.status(404).json({
                status: 404,
                msg: err,
                data: null
            })
        }
        // const limit = req.params.limit ? req.params.limit : null;
        // try {
        //     const data = await UserService.fetchUsers(limit);
        //     res.json(data);
        // }
        // catch (err) {
        //     next(err);
        // }
    }

    async updateUser(req, res) {
        try {
            const userId = req.params.id
            const data = req.body
            if (!userId) {
                return res.status(400).json({
                    status: 400,
                    msg: 'The userID is required',
                    data: null
                })
            }
            const response = await UserService.updateUser(userId, data)
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

    async deleteUser(req, res) {
        try {
            const userId = req.params.id
            if (!userId) {
                return res.status(400).json({
                    status: 400,
                    msg: 'The userID is required',
                    data: null
                })
            }
            const response = await UserService.deleteUser(userId)
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

    async getDetailUser(req, res) {
        try {
            const userId = req.params.id
            if (!userId) {
                return res.status(400).json({
                    status: 400,
                    msg: 'The userID is required',
                    data: null
                })
            }
            const response = await UserService.getDetailUser(userId)
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

    // async logout(req, res) {
    //     localStorage.removeItem('token');
    //     localStorage.removeItem('userType');
    // }
    async logout(req, res) {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                status: 401,
                msg: 'No active session found',
                data: null
            });
        }
        res.clearCookie('token'); // Xóa cookie chứa token
        return res.status(200).json({
            status: 200,
            msg: 'Logged out successfully',
            data: null
        });
    }

    async createPhone(req, res) {
        try {
            const body = req.body;
            const user_id = req.params.id

            if (!(body && user_id)) {
                return res.status(400).json({
                    status: 400,
                    msg: 'The input is required',
                    data: null
                })
            }
            const response = await UserService.createPhone(user_id, body);
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

    async updatePhone(req, res) {
        try {
            const body = req.body;
            const user_id = req.params.id

            if (!(body && user_id)) {
                return res.status(400).json({
                    status: 400,
                    msg: 'The input is required',
                    data: null
                })
            }
            const response = await UserService.updatePhone(user_id, body);
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

    async deletePhone(req, res) {
        try {
            const body = req.body;
            const user_id = req.params.id

            if (!(body && user_id)) {
                return res.status(400).json({
                    status: 400,
                    msg: 'The input is required',
                    data: null
                })
            }
            const response = await UserService.deletePhone(user_id, body);
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

    async getPhone(req, res) {
        try {
            const body = req.body;
            const user_id = req.params.id

            if (!(body && user_id)) {
                return res.status(400).json({
                    status: 400,
                    msg: 'The input is required',
                    data: null
                })
            }
            const response = await UserService.getPhone(user_id);
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

    async createAddress(req, res) {
        try {
            const userId = req.params.id
            if (!userId) {
                return res.status(400).json({
                    status: 400,
                    msg: 'The userID is required',
                    data: null
                })
            }
            if (!req.body) {
                return res.status(400).json({
                    status: 400,
                    msg: 'The input is required',
                    data: null
                })
            }
            const response = await UserService.createAddress(userId, req.body)
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

    async updateAddress(req, res) {
        try {
            const userId = req.params.id
            if (!userId) {
                return res.status(400).json({
                    status: 400,
                    msg: 'The userID is required',
                    data: null
                })
            }
            if (!req.body) {
                return res.status(400).json({
                    status: 400,
                    msg: 'The input is required',
                    data: null
                })
            }
            const response = await UserService.updateAddress(userId, req.body)
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

    async deleteAddress(req, res) {
        try {
            const userId = req.params.id
            if (!userId) {
                return res.status(400).json({
                    status: 400,
                    msg: 'The userID is required',
                    data: null
                })
            }
            const response = await UserService.deleteAddress(userId, req.body)
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

    async getAllAddress(req, res) {
        try {
            const userId = req.params.id
            if (!userId) {
                return res.status(400).json({
                    status: 400,
                    msg: 'The userID is required',
                    data: null
                })
            }
            const response = await UserService.getAllAddress(userId)
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
}

module.exports = new AuthController;
