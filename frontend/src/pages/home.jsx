import React from 'react';
import { Button, Typography, Box, Container, AppBar, Toolbar, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Home = () => {
  const menuItems = ['Dashboard','Data visualization', 'Job', 'Company', 'Posting'];
  const routes = ['/','/datavisualization', '/job', '/company', '/posting']; 

  return (
    <>
      <div>
        <Navbar
          title="LinkedlnJobPosting"
          menuItems={menuItems}
          routes={routes}
          active="Dashboard"
        />
        {/* Đặt lại margin và padding của html, body */}
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
        <Box
          sx={{
            backgroundImage: 'url(https://kinsta.com/wp-content/uploads/2018/09/linkedin-statistics-1200x675.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            marginTop: '64px', // Tránh che bởi AppBar
          }}
        >
          <Container
            sx={{
              textAlign: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.5)', // Nền mờ
              borderRadius: '8px',
              padding: '30px',
              width: '100%',
              maxWidth: '500px', // Giới hạn chiều rộng của container
            }}
          >
            <Typography variant="h4" sx={{ marginBottom: '10px' }}>
              Welcome to our Linkedln Job Posting Web
            </Typography>
            <Typography variant="h6" sx={{ marginBottom: '40px' }}>
            Where opportunities meet talent, empowering careers and building connections globally.
            </Typography>
          </Container>
        </Box>
      </div>
    </>
  );
};

export default Home;
