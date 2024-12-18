const axios = require('axios');
const express = require('express');

async function login(email, password) {
    console.log("Login");
    try { 
        const url = "http://localhost:3000/auth/login";
        const response = await axios.post(url, {
            email: email,
            password: password
        });
        console.log(response.data);
		return response.data 
    } catch (error) {
        throw error;
    }
}

module.exports = { 
    login
};