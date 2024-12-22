const axios = require('axios');
const express = require('express');

async function fetchUsers(req) {
    try {
        const response = await axios.get('http://localhost:3000/users', {
            headers: { Authorization: req.user.token }, // sending the token to the backend app
        }); 
        const data = response?.data?.data?.data || [];
        return data;
    } catch (error) {
        throw error;
    }
}

async function registerUser(user, reqUser) {
    try { 
        const url = 'http://localhost:3000/auth/register';
        const response = await axios.post(url, 
            {
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
            },
            { headers: { Authorization: reqUser.token }
        });
		return response.data 
    } catch (error) {
        throw error;
    }
}

async function editRole(req) {

    try { 
        const url = `http://localhost:3000/users/edit/${req.body.id}`;
        console.log(url);
        const response = await axios.put(url, 
            { roleId: req.body.roleId },
            { headers: { Authorization: req.user.token }
        });
		return response.data 
    } catch (error) {
        throw error;
    }
}

async function deleteUser(req) {
    try { 
        const url = `http://localhost:3000/users/delete/${req.body.userId}`;
        const response = await axios.delete(url, {
            headers: { Authorization: req.user.token }, // sending the token to the backend app
        }); 
		return response.data 
    } catch (error) {
        throw error;
    }
}


module.exports = { 
    fetchUsers,
    registerUser,
    deleteUser,
    editRole
};