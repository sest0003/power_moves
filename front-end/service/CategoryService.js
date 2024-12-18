const axios = require('axios');
const express = require('express');

async function fetchCategories() {
    try {
        const response = await axios.get('http://localhost:3000/categories/all');
        const categoryData = response?.data?.data?.data || [];
        return categoryData;
    } catch (error) {
        console.log('Error fetching categories:', error);
        return []; 
    }
}



async function addCategory(category) {
    try { 
        const url = 'http://localhost:3000/categories/add';
        const response = await axios.post(url, {
            name: category.name
        });
		return response.data 
    } catch (error) {
        throw error;
    }
}

async function editCategory(category) {
    try { 
        const url = `http://localhost:3000/categories/edit/${brand.id}`;
        const response = await axios.put(url, {
            name: category.name
        });
		return response.data 
    } catch (error) {
        throw error;
    }
}

async function deleteCategory(id) {
    try { 
        const url = `http://localhost:3000/categories/delete/${id}`;
        const response = await axios.delete(url);
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