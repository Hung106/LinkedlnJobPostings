
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/product';

export const getProducts = async (filters = {}) => {
    try {
        const { category, minPrice, maxRate, minRate, title } = filters;
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


        // Remove the last '&'
        queryParams = queryParams.slice(0, -1);

        const response = await axios.get(`${API_BASE_URL}/GetProduct${queryParams}`);
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
