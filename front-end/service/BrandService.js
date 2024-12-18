const axios = require('axios');
const express = require('express');

async function fetchBrands() {
    try {
        const response = await axios.get('http://localhost:3000/brands/all');
        const brandData = response?.data?.data?.data || [];
        return brandData;
    } catch (error) {
        console.log('Error fetching brands:', error);
        return []; 
    }
}



async function addBrand(brand) {
    try { 
        const url = 'http://localhost:3000/brands/add';
        const response = await axios.post(url, {
            name: brand.name
        });
		return response.data 
    } catch (error) {
        throw error;
    }
}

async function editBrand(brand) {
    try { 
        const url = `http://localhost:3000/brands/edit/${brand.id}`;
        const response = await axios.put(url, {
            name: brand.name
        });
		return response.data 
    } catch (error) {
        throw error;
    }
}

async function deleteBrand(id) {
    try { 
        const url = `http://localhost:3000/brands/delete/${id}`;
        const response = await axios.delete(url);
		return response.data 
    } catch (error) {
        throw error;
    }
}



module.exports = { 
    fetchBrands, 
    addBrand,
    editBrand,
    deleteBrand
};