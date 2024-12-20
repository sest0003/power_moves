const axios = require('axios');
const express = require('express');

async function fetchProducts(req) {
    try {
        const response = await axios.get('http://localhost:3000/products/all', {
            headers: { Authorization: req.user.token }, // sending the token to the backend app
        }); 
        const productData = response?.data?.data?.data?.slice(0, 20) || [];
        return productData;
    } catch (error) {
        throw error;
    }
}

async function fetchProductsByCategory(id, user) {
    try {
        const url = `http://localhost:3000/products/search/category/${id}`;
        const response = await axios.post(url, {
            headers: { Authorization: user.token }, // sending the token to the backend app
        }); 
        const productData = response?.data?.data?.data || [];
		return productData;
    } catch (error) {
        throw error;
    }
}

async function fetchProductsByBrand(id, user) {
    try {
        const url = `http://localhost:3000/products/search/brand/${id}`;
        const response = await axios.post(url, {
            headers: { Authorization: user.token }, // sending the token to the backend app
        }); 
        const productData = response?.data?.data?.data || [];
		return productData;
    } catch (error) {
        throw error;
    }
}

async function fetchProductsByPartialName(name, user) {
    try { 
        const url = `http://localhost:3000/products/search/${name}`;
        const response = await axios.post(url, {
            headers: { Authorization: user.token }, // sending the token to the backend app
        }); 
        const data = response?.data?.data?.data || [];
		return data;
    } catch (error) {
        throw error;
    }
}

async function addProduct(product, user) {
    try { 
        const url = 'http://localhost:3000/products/add';
        const response = await axios.post(url, 
            {
            name: product.name,
            description: product.desc,
            imageUrl: product.imageUrl,
            unitPrice: product.price,
            stock: product.stock,
            brandId: product.brandId,
            categoryId: product.categoryId
        },
        { headers: { Authorization: user.token }
        });
		return response.data 
    } catch (error) {
        throw error;
    }
}

async function editProduct(product, user) {
    try { 
        /* Change isdelted to boolean */
        let isDeleted = product.isDeleted === 'on' ? true : 'false';

        const url = `http://localhost:3000/products/edit/${product.id}`;
        const response = await axios.put(url, 
            {
            name: product.name,
            description: product.desc,
            imageUrl: product.imageUrl,
            unitPrice: product.price,
            stock: product.stock,
            isDeleted: isDeleted,
            brandId: product.brandId,
            categoryId: product.categoryId
        },
        { headers: { Authorization: user.token }
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
    addProduct,
    editProduct
};