const axios = require('axios');
const express = require('express');

async function fetchOrders(req) {
    try {
        const response = await axios.get('http://localhost:3000/orders/all', {
            headers: { Authorization: req.user.token }, // sending the token to the backend app
        }); 
        const data = response?.data?.data || [];
        return data;
    } catch (error) {
        throw error;
    }
}

async function editOrder(req) {
    try { 
        
        const url = `http://localhost:3000/orders/${req.body.id}`;
        const response = await axios.put(url, 
            { orderStatusId: req.body.statusId },
            { headers: { Authorization: req.user.token }
        });
		return response.data 
    } catch (error) {
        throw error;
    }
}

module.exports = { 
    fetchOrders, 
    editOrder
};