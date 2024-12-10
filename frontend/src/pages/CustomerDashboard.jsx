import React, { useEffect, useState } from 'react';
import { Typography, Box, Container } from '@mui/material';
import Navbar from '../components/Navbar';

const CustomerDashboard = () => {
  const menuItems = ['Trang chủ', 'Mua hàng'];
  const routes = ['/customerdashboard','/buyproduct'];

  const [userName, setUserName] = useState('');
  const [userAvatar, setUserAvatar] = useState('');



  // Hàm lấy thông tin người dùng từ localStorage
  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const parsedData = JSON.parse(userData);
      setUserName(parsedData.username);
      setUserAvatar(parsedData.avatar || 'https://i.pravatar.cc/150?img=3');
    }
  }, []);


  // Hàm đăng xuất
  const handleLogout = () => {
    localStorage.removeItem('token'); // Xóa token
    localStorage.removeItem('userData'); // Xóa thông tin người dùng

    console.log("Đăng xuất thành công!");

    navigate('/'); // Điều hướng về trang chủ hoặc trang đăng nhập
  };

  return (
    <>
      <style>
        {`
          html, body {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            overflow-x: hidden;
          }
        `}
      </style>

      {/* Thanh điều hướng */}
      <Navbar
        title="Customer"
        menuItems={menuItems}
        routes={routes}
        active={"Trang chủ"}
      />

      <Box
        sx={{
          backgroundImage: 'url(https://img.pikbest.com/ai/illus_our/20230426/8e6dd0984b9ce2006e9906471398531d.jpg!w700wp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          marginTop: '64px',
        }}
      >
        <Container
          sx={{
            textAlign: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            borderRadius: '8px',
            padding: '30px',
            width: '100%',
            maxWidth: '500px',
          }}
        >
          <Typography variant="h4" sx={{ marginBottom: '10px', fontSize: '40px' }}>
            Chào mừng đến với Customer Dashboard
          </Typography>
          <Typography variant="h6" sx={{ marginBottom: '40px', fontSize: '20px' }}>
          Hệ thống cung cấp dịch vụ mua hàng trực tuyến nhanh chóng, tiện lợi và tiết kiệm
          </Typography>
        </Container>
      </Box>
    </>
  );
};

export default CustomerDashboard;
