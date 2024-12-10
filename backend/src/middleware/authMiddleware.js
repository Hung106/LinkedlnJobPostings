
const jwt = require('jsonwebtoken');
require('dotenv').config();

class AuthMiddleWare {
    // async authMiddleWare(req, res, next) {
    //     const token = req.headers.token.split(' ')[1]
    //     jwt.verify(token, process.env.SECRET_TOKEN, function (err, user) {
    //         if (err) {
    //             return res.status(404).json({
    //                 status: 404,
    //                 msg: 'the authentication',
    //                 data: null
    //             })
    //         }
    //         const userType = user.userType
    //         if (userType === 'admin') {
    //             next()
    //         } else {
    //             return res.status(404).json({
    //                 status: 404,
    //                 msg: 'The authentication',
    //                 data: null
    //             })
    //         }
    //     });
    // }

    async authUserMiddleWare(req, res, next) {
        //const token = req.headers.token.split(' ')[1]
        const token = req.headers.authorization.split(' ')[1]
        //const userid = req.params.id
        jwt.verify(token, process.env.SECRET_TOKEN, function (err, user) {
            if (err) {
                return res.status(404).json({
                    status: 404,
                    msg: 'the authentication',
                    data: null
                })
            }
            //if (user.userType === 'admin' || user.userId === userid) {
            if (user.userType === 'admin') {
                next()
            } else {
                return res.status(404).json({
                    status: 404,
                    msg: 'The authentication',
                    data: null
                })
            }
        });
    }

    // async authMiddleWare(req, res, next) {
    //     try {
    //         const token = req.cookies.token; // Lấy token từ cookie
    //         if (!token) {
    //             return res.status(401).json({
    //                 status: 401,
    //                 msg: 'Authentication failed',
    //                 data: null
    //             });
    //         }
    //         jwt.verify(token, process.env.SECRET_TOKEN, function (err, user) {
    //             if (err) {
    //                 return res.status(404).json({
    //                     status: 404,
    //                     msg: 'Invalid or expired token',
    //                     data: null
    //                 })
    //             }
    //             // if (user.userType === 'customer' && req.params.id !== user.userId) {
    //             //     return res.status(403).json({
    //             //         status: 403,
    //             //         msg: 'Access denied',
    //             //         data: null
    //             //     });
    //             // }
    //             req.user = user;
    //             next()
    //         });
    //     } catch (error) {
    //         return res.status(500).json({
    //             status: 500,
    //             msg: 'An error occurred during authentication.',
    //             data: null
    //         });
    //     }
    // }


    // async authAdminMiddleware(req, res, next) {
    //     if (req.user && req.user.userType === 'admin') {
    //         next();
    //     } else {
    //         return res.status(403).json({
    //             status: 403,
    //             msg: 'Access denied. Admins only.',
    //             data: null
    //         });
    //     }
    // }

    // async authCustomerMiddleware(req, res, next) {
    //     if (req.user && req.user.userType === 'customer') {
    //         if (req.params.id && req.params.id !== req.user.userId) {
    //             return res.status(403).json({ msg: 'Access denied: Customers can only access their own data.' });
    //         }
    //         next();
    //     } else {
    //         return res.status(403).json({ msg: 'Access denied. Customers only.' });
    //     }
    // }

    // async authUserMiddleWare(req, res, next) {
    //     if (req.user && req.user.userType === 'customer') {
    //         //console.log(req.params.id)
    //         if (req.params.id && req.params.id === req.user.userId) {
    //             next()
    //         }
    //         else {
    //             return res.status(403).json({
    //                 status: 403,
    //                 msg: 'Access denied: Customers can only access their own data',
    //                 data: null
    //             });
    //         }
    //     } else if (req.user && req.user.userType === 'admin') {
    //         next();  // Admin có thể truy cập tất cả thông tin
    //     } else {
    //         return res.status(403).json({
    //             status: 403,
    //             msg: 'Access denied',
    //             data: null
    //         });
    //     }
    // }

    // async authProductMiddleWare(req, res, next) {
    //     if (req.user && req.user.userType === 'customer') {
    //         // Customer chỉ có thể xem sản phẩm, không thể tạo, sửa, xóa
    //         if (req.method === 'GET') {
    //             next();
    //         } else {
    //             return res.status(403).json({
    //                 status: 403,
    //                 msg: 'Access denied: Customers cannot modify products',
    //                 data: null
    //             });
    //         }
    //     } else if (req.user && req.user.userType === 'admin') {
    //         // Admin có thể xem và sửa sản phẩm
    //         next();
    //     } else {
    //         return res.status(403).json({
    //             status: 403,
    //             msg: 'Access denied',
    //             data: null
    //         });
    //     }
    // }
}
module.exports = new AuthMiddleWare;