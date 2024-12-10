import React, { useState, useEffect } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../services/seller';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import Navbar from '../components/Navbar';

const ManageProduct = () => {
    const menuItems = ['Trang chủ', 'Quản lí sản phẩm'];
    const routes = ['/sellerdashboard', '/manageproduct'];
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({
        url: '',
        title: '',
        brand: '',
        description: '',
        breadcrumb: '',
        seller_id: '',
        category_id: '',
        color: '',
        size: '',
        sold: '',
        stock: '',
        initial_price: '',
        final_price: '',
    });
    const [editProduct, setEditProduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [expandedDescription, setExpandedDescription] = useState({}); 

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
        fetchProducts();
    }, [filters]);

    // Handle filter change
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({
            ...filters,
            [name]: value
        });
    };
    const handleAddProduct = async () => {
        const productData = {
            title: newProduct.title,
            final_price: newProduct.final_price,
            seller_id: newProduct.seller_id,
            url: newProduct.url,
            brand: newProduct.brand,
            description: newProduct.description,
            breadcrumb: newProduct.breadcrumb,
            category_id: newProduct.category_id,
            color: newProduct.color,
            size: newProduct.size,
            sold: newProduct.sold,
            stock: newProduct.stock,
            intitial_price: newProduct.initial_price
        };
    
        if (!productData.title || !productData.final_price || !productData.seller_id || !productData.url || !productData.brand || !productData.description || !productData.breadcrumb || !productData.category_id || !productData.color || !productData.size || !productData.sold || !productData.stock || !productData.intitial_price) {
            setError('Please fill in all required fields');
            return;
        }
    
        setLoading(true);
        setError('');
        try {
            const result = await createProduct(productData); // Giả sử createProduct gửi một POST request đến API
            // Check if result has valid product data
            if (result && result.data) {
                alert('Sản phẩm đã được thêm');
                setNewProduct({
                    url: '',
                    title: '',
                    brand: '',
                    description: '',
                    breadcrumb: '',
                    seller_id: '',
                    category_id: '',
                    color: '',
                    size: '',
                    sold: '',
                    stock: '',
                    intitial_price: '',
                    final_price: '',
                });
    
                // Assuming the new product object returned contains 'product_id'
                const newProductData = result.data;
    
                // Add the new product to the list
                setProducts((prevProducts) => [...prevProducts, newProductData]);
            }
            alert('Thêm thành công')
        } catch (error) {
            alert('Lỗi khi thêm sản phẩm');
        } finally {
            setLoading(false);
        }
    };
    


    const handleUpdateProduct = async () => {
        // Kiểm tra nếu không có sản phẩm để chỉnh sửa
        if (!editProduct) {
            setError('No product selected for update');
            return;
        }
    
        // Đặt trạng thái loading và reset lỗi
        setLoading(true);
        setError('');
    
        try {
            // Cập nhật sản phẩm thông qua API
            const updatedProduct = await updateProduct(editProduct);
    
            // Kiểm tra dữ liệu trả về từ API
            if (!updatedProduct || !updatedProduct.product_id) {
                setError('Invalid product data returned from API');
                return;
            }
    
            // Cập nhật danh sách sản phẩm
            setProducts((prevProducts) => {
                return prevProducts.map((product) => 
                    product.product_id === updatedProduct.product_id ? updatedProduct : product
                );
            });
    
            // Đóng dialog chỉnh sửa sau khi lưu thành công
            setEditProduct(null);
    
            // Thông báo thành công (tuỳ chọn)
            alert('Product updated successfully');
        } catch (error) {
            // Xử lý lỗi trong trường hợp có sự cố
            setError('Error updating product: ' + (error?.message || 'Unknown error'));
        } finally {
            // Đặt trạng thái loading lại về false
            setLoading(false);
        }
    };
    
    // Handle delete product
    const handleDeleteProduct = async (productId) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        setLoading(true);
        setError('');
        try {
            await deleteProduct(productId);
            setProducts((prevProducts) => prevProducts.filter((product) => product.product_id !== productId));
        } catch (error) {
            setError('Error deleting product');
        } finally {
            setLoading(false);
        }
    };

    // Toggle Description Visibility
    const toggleDescription = (productId) => {
        setExpandedDescription((prevState) => ({
            ...prevState,
            [productId]: !prevState[productId]
        }));
    };

    return (
        <div>
            <Navbar
                title="Seller"
                menuItems={menuItems}
                routes={routes}
                active={"Quản lí sản phẩm"}
            />
            <div style={{ margin: '20px' }}>
                <h2
                    style={{
                        fontSize: '28px',
                        fontWeight: 'bold',
                        color: '#84c1f8',
                        marginBottom: '40px',
                        textAlign: 'center',
                        marginTop: '90px',
                    }}
                >
                    Manage Products
                </h2>
            </div>
            {/* Error Message */}
            {error && <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>}
            <Button 
    onClick={() => setNewProduct({
        url: '', 
        title: '', 
        brand: '', 
        description: '', 
        breadcrumb: '', 
        seller_id: '', 
        category_id: '', 
        color: '', 
        size: '', 
        sold: '', 
        stock: '', 
        intitial_price: '', 
        final_price: ''
    })} 
    color="primary"
>
    Add New Product
</Button>

{/* Add Product Form */}
<div>
    {/* Vòng lặp qua các khóa của đối tượng newProduct */}
    {Object.keys(newProduct).map((key) => (
        <TextField
            key={key} // Sử dụng key duy nhất cho mỗi TextField
            label={key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' ')} // Chuyển đổi chữ cái đầu thành in hoa và thay _ bằng khoảng trắng
            name={key} // Đảm bảo rằng mỗi trường có tên phù hợp
            value={newProduct[key]} // Truyền giá trị tương ứng từ newProduct
            onChange={(e) => setNewProduct({
                ...newProduct, // Giữ nguyên các giá trị cũ
                [key]: e.target.value // Cập nhật giá trị cho trường tương ứng
            })}
            style={{ marginBottom: '10px', display: 'block' }} // Căn chỉnh và khoảng cách giữa các trường
        />
    ))}
    {/* Nút thêm sản phẩm, chỉ cho phép nhấn khi không đang trong trạng thái loading */}
    <Button 
        onClick={handleAddProduct} 
        disabled={loading} 
        color="primary"
        variant="contained"
    >
        Add Product
    </Button>
</div>
            {/* Filters */}
            <div>
                <h3>Filter Products</h3>
                <div>
                    <TextField
                        label="Product Title"
                        name="title"
                        value={filters.title}
                        onChange={handleFilterChange}
                        style={{ marginRight: '20px' }}
                    />
                    <TextField
                        label="Category"
                        name="category"
                        value={filters.category}
                        onChange={handleFilterChange}
                        style={{ marginRight: '20px' }}
                    />
                    <TextField
                        label="Min Price"
                        type="number"
                        name="minPrice"
                        value={filters.minPrice}
                        onChange={handleFilterChange}
                        style={{ marginRight: '20px' }}
                    />
                    <TextField
                        label="Max Price"
                        type="number"
                        name="maxPrice"
                        value={filters.maxPrice}
                        onChange={handleFilterChange}
                        style={{ marginRight: '20px' }}
                    />
                    <TextField
                        label="Max Rate"
                        type="number"
                        name="maxRate"
                        value={filters.maxRate}
                        onChange={handleFilterChange}
                        style={{ marginRight: '20px' }}
                    />
                    <TextField
                        label="Min Rate"
                        type="number"
                        name="minRate"
                        value={filters.minRate}
                        onChange={handleFilterChange}
                        style={{ marginRight: '20px' }}
                    />
                    <Button onClick={() => setFilters({})}>Clear Filters</Button>
                </div>
            </div>

            {/* List of Products */}
            <h3>All Products</h3>
            {loading ? <p>Loading products...</p> : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center" style={{ border: '1px solid #ddd' }}>Title</TableCell>
                                <TableCell align="center" style={{ border: '1px solid #ddd' }}>Description</TableCell>
                                <TableCell align="center" style={{ border: '1px solid #ddd' }}>Review Count</TableCell>
                                <TableCell align="center" style={{ border: '1px solid #ddd' }}>Rating Average</TableCell>
                                <TableCell align="center" style={{ border: '1px solid #ddd' }}>Initial Price</TableCell>
                                <TableCell align="center" style={{ border: '1px solid #ddd' }}>Final Price</TableCell>
                                <TableCell align="center" style={{ border: '1px solid #ddd' }}>Stock</TableCell>
                                <TableCell align="center" style={{ border: '1px solid #ddd' }}>Color</TableCell>
                                <TableCell align="center" style={{ border: '1px solid #ddd' }}>Size</TableCell>
                                <TableCell align="center" style={{ border: '1px solid #ddd' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {products.map((product, index) => (
                                <TableRow key={`${product.product_id}-${index}`}>
                                    <TableCell align="center" style={{ border: '1px solid #ddd' }}>{product.title}</TableCell>
                                    <TableCell align="center" style={{ border: '1px solid #ddd' }}>
                                        <Button onClick={() => toggleDescription(product.product_id)}>
                                            {expandedDescription[product.product_id] ? 'Hide' : 'Show'} Description
                                        </Button>
                                        {expandedDescription[product.product_id] && (
                                            <div
                                                style={{
                                                    whiteSpace: 'pre-wrap',
                                                    wordWrap: 'break-word',
                                                    marginTop: '10px',
                                                    fontSize: '14px',
                                                    color: '#555',
                                                }}
                                            >
                                                {product.description}
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell align="center" style={{ border: '1px solid #ddd' }}>{product.review_nums}</TableCell>
                                    <TableCell align="center" style={{ border: '1px solid #ddd' }}>{product.rating_average}</TableCell>
                                    <TableCell align="center" style={{ border: '1px solid #ddd' }}>{product.intitial_price}</TableCell>
                                    <TableCell align="center" style={{ border: '1px solid #ddd' }}>{product.final_price}</TableCell>
                                    <TableCell align="center" style={{ border: '1px solid #ddd' }}>{product.stock}</TableCell>
                                    <TableCell align="center" style={{ border: '1px solid #ddd' }}>{product.color ? product.color.join(', ') : 'N/A'}</TableCell>
                                    <TableCell align="center" style={{ border: '1px solid #ddd' }}>{product.size}</TableCell>
                                    <TableCell>
                                        <Button onClick={() => setEditProduct(product)} disabled={loading}>Edit</Button>
                                        <Button onClick={() => handleDeleteProduct(product.product_id)} disabled={loading}>Delete</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>

                    </Table>
                </TableContainer>
            )}

            {/* Edit Product Dialog */}
            <Dialog open={Boolean(editProduct)} onClose={() => setEditProduct(null)}>
                <DialogTitle>Edit Product</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Title"
                        value={editProduct?.title || ''}
                        onChange={(e) => setEditProduct({ ...editProduct, title: e.target.value })}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Price"
                        type="number"
                        value={editProduct?.final_price || ''}
                        onChange={(e) => setEditProduct({ ...editProduct, final_price: e.target.value })}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Description"
                        value={editProduct?.description || ''}
                        onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Color"
                        value={editProduct?.color?.join(', ') || ''}
                        onChange={(e) => setEditProduct({
                            ...editProduct,
                            color: e.target.value.split(',').map(item => item.trim())
                        })}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Size"
                        value={editProduct?.size || ''}
                        onChange={(e) => setEditProduct({ ...editProduct, size: e.target.value })}
                        fullWidth
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditProduct(null)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleUpdateProduct} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ManageProduct;
