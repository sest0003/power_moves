const axios = require('axios');
const express = require('express');

async function fetchOrders() {
    try {
        const response = await axios.get('http://localhost:3000/orders/all');
        const data = response?.data?.data || [];
        return data;
    } catch (error) {
        throw error;
    }
}

async function editOrder(order) {
    try { 
        
        const url = `http://localhost:3000/orders/${order.id}`;
        console.log(url);
        const response = await axios.put(url, {
            orderStatusId: order.statusId
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