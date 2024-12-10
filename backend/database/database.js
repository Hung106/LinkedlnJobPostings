const sql = require('mssql');

// Cấu hình kết nối
const config = {
    user: 'posting', // Tên người dùng SQL Server
    password: 'posting', // Để trống nếu không có mật khẩu
    server: 'localhost', // Tên server hoặc IP
    database: 'linkedln_job_posting', // Tên cơ sở dữ liệu
    port: 1433, // Cổng mặc định của SQL Server
    options: {
        encrypt: false, // Nếu không sử dụng SSL
        trustServerCertificate: true, // Dùng trong môi trường phát triển để bỏ qua SSL
    },
};

// Kết nối với SQL Server
const clientConnect = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('Connected to SQL Server');
        return pool;
    })
    .catch(err => {
        console.error('Database connection failed:', err);
        throw err;
    });

module.exports = { sql, clientConnect };
