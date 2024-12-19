const axios = require('axios');
const express = require('express');

async function fetchUsers() {
    try {
        const response = await axios.get('http://localhost:3000/users/all');
        const userData = response?.data?.data?.data || [];
        console.log(userData);
        return userData;
    } catch (error) {
        console.log('Error fetching users:', error);
        return []; 
    }
}

async function registerUser(user) {
    try { 
        const url = 'http://localhost:3000/auth/register';
        const response = await axios.post(url, {
            firstname: user.firstname,
            lastname: user.lastname,
            username: user.username,
            email: user.email,
            adress: user.adress,
            phone: user.phone,
            password: user.password,
            salt: user.salt,
            membershipId: 1,
            roleId: 2,
            sumOfUnits: 0
        });
		return response.data 
    } catch (error) {
        throw error;
    }
}


async function deleteUser(id) {
    try { 
        const url = `http://localhost:3000/users/delete/${id}`;
        const response = await axios.delete(url);
		return response.data 
    } catch (error) {
        throw error;
    }
}


module.exports = { 
    fetchUsers,
    registerUser,
    deleteUser
};