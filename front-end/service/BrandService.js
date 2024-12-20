const axios = require('axios');
const express = require('express');

async function fetchBrands(req) {
   
   
    try {
        const response = await axios.get('http://localhost:3000/brands', {
            headers: { Authorization: req.user.token }, // sending the token to the backend app
        }); 
        const data = response?.data?.data?.data || [];
        return data;
    } catch (error) {
        throw error;
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