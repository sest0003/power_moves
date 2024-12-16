const axios = require('axios');
const e = require('express');

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

async function addProduct(product) {
    try { 
        const url = 'http://localhost:3000/products/add';
        const response = await axios.post(url, {
            name: product.name,
            description: product.desc,
            imageUrl: product.imageUrl,
            unitPrice: product.price,
            stock: product.stock,
            brandId: product.brandId,
            categoryId: product.categoryId
        });
		return response.data 
    } catch (error) {
        throw error;
    }
}

module.exports = { 
    fetchProducts, 
    fetchProductsByBrand, 
    fetchProductsByCategory, 
    fetchProductsByPartialName, 
    addProduct 
};