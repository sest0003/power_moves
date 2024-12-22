const axios = require('axios');
const express = require('express');

async function fetchCategories(req) {
    try {
        const response = await axios.get('http://localhost:3000/categories', {
            headers: { Authorization: req.user.token }, // sending the token to the backend app
        }); 
        const data = response?.data?.data?.data || [];
        return data;
    } catch (error) {
        throw error;
    }
}



async function addCategory(req) {
    try { 
        const url = 'http://localhost:3000/categories/add';
        const response = await axios.post(url, 
            { name: req.body.name },
            { headers: { Authorization: req.user.token }
    });
		return response.data 
    } catch (error) {
        throw error;
    }
}

async function editCategory(req) {
    try { 
        const url = `http://localhost:3000/categories/edit/${req.body.id}`;
        const response = await axios.put(url,
            { name: req.body.name },
            { headers: { Authorization: req.user.token }
        });
		return response.data 
    } catch (error) {
        throw error;
    }
}

async function deleteCategory(req) {
    try { 
        const url = `http://localhost:3000/categories/delete/${req.body.categoryId}`;
        const response = await axios.delete(url, {
            headers: { Authorization: req.user.token },
        });
		return response.data 
    } catch (error) {
        throw error;
    }
}

module.exports = { 
    fetchCategories, 
    addCategory,
    editCategory,
    deleteCategory
};