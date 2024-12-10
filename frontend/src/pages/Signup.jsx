import React, { useState } from 'react';
import { TextField, Button, Box, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      setError("Mật khẩu và xác nhận mật khẩu không khớp.");
      return;
    }

    try {
      // Gửi yêu cầu đăng ký tới backend
      const response = await axios.post('http://localhost:8000/api/user/signUp', {
        email,
        password,
        confirmPassword
      });

      // Kiểm tra phản hồi từ backend
      if (response.data.status === 200) {
        alert('Đăng ký thành công!');
        // Redirect to login page or another page
        navigate('/login');
      } else {
        setError('Đăng ký thất bại, vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Lỗi khi đăng ký:', error);
      setError('Đã xảy ra lỗi, vui lòng thử lại!');
    }
  };

  return (
    <Container sx={{ maxWidth: 400, marginTop: 8 }}>
      <Box sx={{ textAlign: 'center', padding: 4, borderRadius: 2, backgroundColor: '#ffffff', boxShadow: 3 }}>
        {/* Thêm logo vào đây */}
        <img 
          src="https://hcmut.edu.vn/img/nhanDienThuongHieu/01_logobachkhoatoi.png" 
          alt="Logo" 
          style={{ width: '200px', height: 'auto', marginBottom: '20px' }} 
        />
        
        <Typography variant="h5" sx={{ marginBottom: 4, fontWeight: 'bold', color: '#3f51b5' }}>
          Đăng ký
        </Typography>

        {/* Display error message if any */}
        {error && <Typography sx={{ color: 'red', marginBottom: 2 }}>{error}</Typography>}
        
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '10px',
            },
            '& .MuiInputLabel-root': {
              fontWeight: 'bold',
            },
          }}
        />
        
        <TextField
          label="Mật khẩu"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '10px',
            },
            '& .MuiInputLabel-root': {
              fontWeight: 'bold',
            },
          }}
        />
        
        <TextField
          label="Xác nhận mật khẩu"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '10px',
            },
            '& .MuiInputLabel-root': {
              fontWeight: 'bold',
            },
          }}
        />

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{
            marginTop: 3,
            borderRadius: '20px',
            padding: '10px',
            fontWeight: 'bold',
            boxShadow: '0px 5px 15px rgba(63, 81, 181, 0.3)',
            '&:hover': {
              backgroundColor: '#3f51b5',
              boxShadow: '0px 10px 20px rgba(63, 81, 181, 0.3)',
            },
          }}
          onClick={handleSignUp}
        >
          Đăng ký
        </Button>

        <Button
          variant="text"
          color="secondary"
          fullWidth
          sx={{
            marginTop: 2,
            fontWeight: 'bold',
          }}
          onClick={() => navigate('/login')}
        >
          Đã có tài khoản? Đăng nhập
        </Button>
      </Box>
    </Container>
  );
};

export default SignUp;
