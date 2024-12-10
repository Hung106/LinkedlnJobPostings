import React from 'react';
import { BrowserRouter as Router, Routes, Route ,Outlet,Navigate} from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/login';
import CustomerDashboard from './pages/CustomerDashboard'
import SellerDashboard from './pages/SellerDashboard';
import SignUp from './pages/Signup';
import ManageProduct from './pages/ManageProduct'
import BuyProduct from './pages/BuyProduct'
const SellerRole = () => {
  const isAuthenticated = localStorage.getItem('token');
  const usertype = JSON.parse(localStorage.getItem('userData')).user_type;
  if (isAuthenticated && (usertype=='customer')) {
    return <Navigate to="/customerdashboard" />;
  }
  else if (!isAuthenticated) {
    return <Navigate to="/" />;
  }
  
  return <Outlet />;
};
const CustomerRole = () => {
  const isAuthenticated = localStorage.getItem('token');
  const usertype = JSON.parse(localStorage.getItem('userData')).user_type;
  if (isAuthenticated && (usertype=='seller')) {
    return <Navigate to="/sellerdashboard" />;
  }
  else if (!isAuthenticated) {
    return <Navigate to="/" />;
  }
  
  return <Outlet />;
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Home />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/login" element={<Login />} />

        {/* Private Routes */}
        <Route element={<SellerRole />}>
          <Route path="/sellerdashboard" element={<SellerDashboard />} />
          <Route path="/manageproduct" element={<ManageProduct />} />

        </Route>
        <Route element={<CustomerRole />}>
          <Route path="/customerdashboard" element={<CustomerDashboard />} />
          <Route path="/buyproduct" element={<BuyProduct />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
