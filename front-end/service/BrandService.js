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



async function addBrand(req) {
    try { 
        const url = 'http://localhost:3000/brands/add';
        const response = await axios.post(url, 
            { name: req.body.name },
            { headers: { Authorization: req.user.token }
        });
        console.log(response);
		return response.data 
    } catch (error) {
        throw error;
    }
}

async function editBrand(req) {

    try { 
        const url = `http://localhost:3000/brands/edit/${req.body.id}`;
        console.log(url);
        const response = await axios.put(url, {
             name: req.body.name },
            { headers: { Authorization: req.user.token }
        });
		return response.data 
    } catch (error) {
        throw error;
    }
}

async function deleteBrand(req) {
    try { 
        const url = `http://localhost:3000/brands/delete/${req.body.brandId}`;
        const response = await axios.delete(url, {
            headers: { Authorization: req.user.token }, // sending the token to the backend app
        }); 
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