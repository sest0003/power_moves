const axios = require('axios');
const express = require('express');

async function fetchMemberships(req) {
    try {
        const response = await axios.get('http://localhost:3000/memberships', {
            headers: { Authorization: req.user.token }, // sending the token to the backend app
        }); 
        const data = response?.data?.data?.data || [];
        return data;
    } catch (error) {
        throw error;
    }
}



async function addMembership(req) {
    try { 
        const url = 'http://localhost:3000/memberships/add';
        const response = await axios.post(url, 
            { type: req.body.type, discount: req.body.discount },
            { headers: { Authorization: req.user.token }
        });
		return response.data 
    } catch (error) {
        throw error;
    }
}

async function editMembership(req) {
    try { 
        const url = `http://localhost:3000/memberships/edit/${req.body.id}`;
        console.log(url);
        const response = await axios.put(url, 
            { type: req.body.type, discount: req.body.discount },
            { headers: { Authorization: req.user.token }
        });;
		return response.data 
    } catch (error) {
        throw error;
    }
}

async function deleteMembership(req) {
    try { 
        const url = `http://localhost:3000/memberships/delete/${req.body.membershipId}`;
        const response = await axios.delete(url, {
            headers: { Authorization: req.user.token }, // sending the token to the backend app
        }); 
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