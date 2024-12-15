const axios = require('axios');

async function fetchProducts() {
    try {
        const response = await axios.get('http://localhost:3000/products/all');
        const productData = response?.data?.data?.data?.slice(0, 20) || [];
		return productData;
    } catch (error) {
        console.log('Error fetching products:', error);
        return []; 
    }
}

async function fetchProductsByCategory(id) {
    try {
        const url = `http://localhost:3000/products/search/category/${id}`;
        const response = await axios.post(url);
        const productData = response?.data?.data?.data || [];
		return productData;
    } catch (error) {
        console.log('Error fetching products:', error);
        return []; 
    }
}

async function fetchProductsByBrand(id) {
    try {
        const url = `http://localhost:3000/products/search/brand/${id}`;
        const response = await axios.post(url);
        const productData = response?.data?.data?.data || [];
		return productData;
    } catch (error) {
        console.log('Error fetching products:', error);
        return []; 
    }
}

async function fetchProductsByPartialName(name) {
    try { 
        const url = `http://localhost:3000/products/search/${name}`;
        const response = await axios.post(url);
        const productData = response?.data?.data?.data || [];
		return productData;
    } catch (error) {
        console.log('Error fetching products:', error);
        return []; 
    }
}

module.exports = { fetchProducts, fetchProductsByBrand, fetchProductsByCategory, fetchProductsByPartialName };