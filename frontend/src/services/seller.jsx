import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/product';

// API - Get All Products
export const getProducts = async (filters = {}) => {
    try {
        const { category, minPrice, maxRate, minRate, title } = filters;

        // Retrieve userData from localStorage
        const userData = localStorage.getItem('userData'); 
        const userId = userData ? JSON.parse(userData).user_id : null; 

        let queryParams = `?`;

        // Append filters to query string
        if (title) {
            queryParams += `title=${title}&`;
            console.log('title filter:', title); 
        }
        if (category) {
            queryParams += `category=${category}&`;
            console.log('category filter:', category); 
        }
        if (minPrice) {
            queryParams += `minPrice=${minPrice}&`;
            console.log('minPrice filter:', minPrice); 
        }
        if (maxRate) {
            queryParams += `maxRate=${maxRate}&`;
            console.log('maxRate filter:', maxRate); 
        }
        if (minRate) {
            queryParams += `minRate=${minRate}&`;
            console.log('minRate filter:', minRate);
        }

        // Add user_id to queryParams if available
        if (userId) {
            queryParams += `seller_id=${userId}&`;
        }

        // Remove the last '&'
        queryParams = queryParams.slice(0, -1);

        const response = await axios.get(`${API_BASE_URL}/getProductBySeller${queryParams}`);
        console.log('API response:', response); // Log the full response
        if (response.data && Array.isArray(response.data.data)) {
            console.log('Products data:', response.data.data); 
            return response.data.data;
        } else {
            console.error('API response does not contain products:', response.data);
            return []; 
        }
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};


// API - Create Product
export const createProduct = async (product) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/CreateProduct`, product);
        return response.data;
    } catch (error) {
        console.error('Error creating product', error);
        throw error;
    }
};

// API - Update Product
export const updateProduct = async (productId, updatedProduct) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/UpdateProduct?product_id=${productId}`, updatedProduct);
        return response.data;
    } catch (error) {
        console.error('Error updating product', error);
        throw error;
    }
};

// API - Delete Product
export const deleteProduct = async (productId) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/DeleteProduct?product_id=${productId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting product', error);
        throw error;
    }
};
