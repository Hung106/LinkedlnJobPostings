import React, { useState, useEffect } from 'react';
import { getProducts } from '../services/customer';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField,
  Dialog, DialogActions, DialogContent, DialogTitle
} from '@mui/material';
import Navbar from '../components/Navbar';
import axios from 'axios'; // Sử dụng axios để gửi yêu cầu API

const BuyProduct = () => {
  const menuItems = ['Trang chủ', 'Mua hàng'];
  const routes = ['/sellerdashboard', '/buyproduct'];
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expandedDescription, setExpandedDescription] = useState({});
  const [selectedProducts, setSelectedProducts] = useState({}); // State để lưu trữ sản phẩm đã chọn với số lượng

  // Filter States
  const [filters, setFilters] = useState({
    title: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    maxRate: '',
    minRate: ''
  });

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getProducts(filters);
      console.log('Fetched products:', data); // Log the data to verify the response
      setProducts(Array.isArray(data) ? data : []); // Ensure 'data' is an array
    } catch (error) {
      setError('Error fetching products');
    } finally {
      setLoading(false);
    }
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
  };

  // Toggle Description Visibility
  const toggleDescription = (uniqueKey) => {
    setExpandedDescription(prevState => ({
      ...prevState,
      [uniqueKey]: !prevState[uniqueKey]
    }));
  };

  // Handle quantity change
  const handleQuantityChange = (uniqueKey, value, stock) => {
    const qty = parseInt(value, 10);
    if (isNaN(qty) || qty < 0) return;

    setSelectedProducts(prev => ({
      ...prev,
      [uniqueKey]: {
        ...prev[uniqueKey],
        quantity: qty > stock ? stock : qty // Giới hạn số lượng không vượt quá stock
      }
    }));
  };

  // Handle Buy Action
  const handleBuy = async () => {
    const orderList = Object.keys(selectedProducts).map(uniqueKey => {
      const [product_id, color, size] = uniqueKey.split('-');
      const product = products.find(p => p.product_id === product_id && p.color === color && p.size === size);
      const quantity = selectedProducts[uniqueKey].quantity;

      return {
        product_id,
        color,
        size,
        quantity,
        paid_price: product.final_price
      };
    }).filter(item => item.quantity > 0); // Lọc chỉ những sản phẩm có số lượng mua > 0

    if (orderList.length === 0) {
      setError('Please select at least one product to buy.');
      return;
    }

    // Lấy customer_id từ localStorage
    const userData = localStorage.getItem('userData');
    const userId = userData ? JSON.parse(userData).user_id : null;

    // Nếu không có userId, hiển thị thông báo lỗi
    if (!userId) {
      setError('User not logged in.');
      return;
    }

    // Tạo đối tượng orderData
    const orderData = {
      ship: "065e40b9-3272-4c94-a92a-e44b5163b18b", // Giá trị mặc định cho ship
      payment_method: "MOMO", // Payment method có thể thay đổi tùy theo nhu cầu
      list: orderList
    };

    setLoading(true);
    setError('');

    try {
      // Gửi yêu cầu POST tới API
      const response = await axios.post(`http://localhost:8000/api/order/create?customer_id=${userId}`, orderData);
      console.log('Order response:', response.data);
      alert('Order placed successfully!');
      setSelectedProducts({}); // Reset chọn sản phẩm sau khi đặt hàng thành công
    } catch (err) {
      console.error('Error placing order:', err);
      setError('Error placing order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar
        title="Seller"
        menuItems={menuItems}
        routes={routes}
        active="Mua hàng"
      />
      <div style={styles.header}>
        <h2>Mua Hàng</h2>
      </div>

      {/* Error Message */}
      {error && <div style={styles.error}>{error}</div>}

      {/* Filters */}
      <div>
        <h3>Filter Products</h3>
        <div style={styles.filterContainer}>
          <TextField
            label="Product Title"
            name="title"
            value={filters.title}
            onChange={handleFilterChange}
            style={styles.filterInput}
          />
          <TextField
            label="Category"
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            style={styles.filterInput}
          />
          <TextField
            label="Min Price"
            type="number"
            name="minPrice"
            value={filters.minPrice}
            onChange={handleFilterChange}
            style={styles.filterInput}
          />
          <TextField
            label="Max Price"
            type="number"
            name="maxPrice"
            value={filters.maxPrice}
            onChange={handleFilterChange}
            style={styles.filterInput}
          />
          <TextField
            label="Max Rate"
            type="number"
            name="maxRate"
            value={filters.maxRate}
            onChange={handleFilterChange}
            style={styles.filterInput}
          />
          <TextField
            label="Min Rate"
            type="number"
            name="minRate"
            value={filters.minRate}
            onChange={handleFilterChange}
            style={styles.filterInput}
          />
          <Button onClick={() => setFilters(initialFilterState)}>Clear Filters</Button>
        </div>
      </div>

      {/* List of Products */}
      <h3>All Products</h3>
      {loading ? <p>Loading products...</p> : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {['Title', 'Description', 'Review Count', 'Rating Average', 'Initial Price', 'Final Price', 'Stock', 'Color', 'Size', 'Quantity'].map(header => (
                  <TableCell key={header} align="center" style={styles.tableCell}>{header}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product, index) => {
                const uniqueKey = `${product.product_id}-${product.color}-${product.size}`;
                return (
                  <TableRow key={uniqueKey}>
                    <TableCell align="center">{product.title}</TableCell>
                    <TableCell align="center">
                      <Button onClick={() => toggleDescription(uniqueKey)}>
                        {expandedDescription[uniqueKey] ? 'Hide' : 'Show'} Description
                      </Button>
                      {expandedDescription[uniqueKey] && <div>{product.description}</div>}
                    </TableCell>
                    <TableCell align="center">{product.review_nums}</TableCell>
                    <TableCell align="center">{product.rating_average}</TableCell>
                    <TableCell align="center">{product.intitial_price}</TableCell>
                    <TableCell align="center">{product.final_price}</TableCell>
                    <TableCell align="center">{product.stock}</TableCell>
                    <TableCell align="center">{product.color}</TableCell>
                    <TableCell align="center">{product.size}</TableCell>
                    <TableCell align="center">
                      <TextField
                        type="number"
                        value={selectedProducts[uniqueKey]?.quantity || 0}
                        onChange={(e) => handleQuantityChange(uniqueKey, e.target.value, product.stock)}
                        inputProps={{ min: 0, max: product.stock }}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <div>
        <Button onClick={handleBuy} disabled={loading}>Buy Selected Products</Button>
      </div>
    </div>
  );
};
// Initial states
const initialFilterState = {
  title: '',
  category: '',
  minPrice: '',
  maxPrice: '',
  maxRate: '',
  minRate: ''
};

const styles = {
  header: {
    margin: '20px',
    textAlign: 'center',
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#84c1f8',
    marginBottom: '40px',
    marginTop: '90px'
  },
  error: {
    color: 'red',
    marginBottom: '20px',
    textAlign: 'center'
  },
  filterContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    marginBottom: '20px'
  },
  filterInput: {
    minWidth: '150px'
  },
  tableCell: {
    border: '1px solid #ddd'
  },
  description: {
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
    marginTop: '10px',
    fontSize: '14px',
    color: '#555'
  },
  buyButtonContainer: {
    marginTop: '20px',
    textAlign: 'center'
  }
};

export default BuyProduct;
