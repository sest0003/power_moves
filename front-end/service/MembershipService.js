const axios = require('axios');
const express = require('express');

async function fetchMemberships() {
    try {
        const response = await axios.get('http://localhost:3000/memberships');
        const data = response?.data?.data?.data || [];
        return data;
    } catch (error) {
        throw error;
    }
}



async function addMembership(membership) {
    try { 
        const url = 'http://localhost:3000/memberships/add';
        const response = await axios.post(url, {
            type: membership.type,
            discount: membership.discount
        });
		return response.data 
    } catch (error) {
        throw error;
    }
}

async function editMembership(membership) {
    try { 
        const url = `http://localhost:3000/memberships/edit/${membership.id}`;
        const response = await axios.put(url, {
            type: membership.type,
            discount: membership.discount
        });
		return response.data 
    } catch (error) {
        throw error;
    }
}

async function deleteMembership(id) {
    try { 
        const url = `http://localhost:3000/memberships/delete/${id}`;
        const response = await axios.delete(url);
		return response.data 
    } catch (error) {
        throw error;
    }
}



module.exports = { 
  fetchMemberships,
  addMembership,
  editMembership,
  deleteMembership
};