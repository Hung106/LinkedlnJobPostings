import React, { useState } from 'react'; 
import { TextField, Button, Box, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      // Gửi yêu cầu đăng nhập tới backend
      const response = await axios.post('http://localhost:8000/api/user/login', {
        email,
        password,
      });

      // Kiểm tra phản hồi từ backend
      if (response.request.status === 200) {
        const { token, loadedUser } = response.data.data;  // Lấy token và loadedUser từ response

        // Lưu token vào localStorage để sử dụng cho các yêu cầu API sau
        localStorage.setItem('token', token);

        // Lưu thông tin người dùng vào localStorage
        localStorage.setItem('userData', JSON.stringify(loadedUser));

        // Kiểm tra ID và phân loại vai trò người dùng
        if (loadedUser.user_type=='customer') { 
          // Vai trò là spso
          navigate('/customerdashboard');
        } else if (loadedUser.user_type=='seller') {
          // Vai trò là student
          navigate('/sellerdashboard');
        } else {
          alert('Không xác định vai trò người dùng.');
        }
      } else {
        alert('Đăng nhập thất bại!');
      }
    } catch (error) {
      console.error('Lỗi khi đăng nhập:', error);
      alert('Đã xảy ra lỗi. Vui lòng thử lại!');
    }
  };

  const handleSignUp = () => {
    // Navigate to the sign-up page
    navigate('/sign-up');
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
          Đăng nhập
        </Typography>
        
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
          onClick={handleLogin}
        >
          Đăng nhập
        </Button>
        
        {/* Thêm nút Đăng ký */}
        <Button
          variant="outlined"
          color="secondary"
          fullWidth
          sx={{
            marginTop: 2,
            borderRadius: '20px',
            padding: '10px',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: '#f1f1f1',
            },
          }}
          onClick={handleSignUp}
        >
          Đăng ký
        </Button>
      </Box>
    </Container>
  );
};

export default Login;