const express = require('express');
const router = express.Router();
const userService = require('../services/userService');
const auth = require('../middleware/auth');

// Sign up
router.post('/signup', async (req, res) => {
    try {
        const user = await userService.createUser(req.body);
        const token = user.generateAuthToken();
        
        // Set token in cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        res.status(201).json({ user, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userService.loginUser(email, password);
        const token = user.generateAuthToken();

        // Set token in cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        res.json({ user, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Logout
router.post('/logout', auth, (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
});

// Update user
router.put('/:id', auth, async (req, res) => {
    try {
        const user = await userService.updateUser(req.params.id, req.body);
        res.json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete user
router.delete('/:id', auth, async (req, res) => {
    try {
        await userService.deleteUser(req.params.id);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update points
router.patch('/:id/points', auth, async (req, res) => {
    try {
        const user = await userService.updatePoints(req.params.id, req.body.points);
        res.json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Set team
router.patch('/:id/team', auth, async (req, res) => {
    try {
        const user = await userService.setTeam(req.params.id, req.body.teamId);
        res.json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router; 