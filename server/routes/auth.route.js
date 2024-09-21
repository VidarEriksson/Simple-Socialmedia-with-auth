const express = require('express');
const router = express.Router();
const jwtUtils = require('../utils/jwt.utils');
const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.getUserByEmail(email);
        if (!user) {
            return res.status(401).json({ error: 'Invalid email' });
        }
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid password' });
        }
        const token = jwtUtils.generateToken(user);
        res.json({ success: true, token });
    } catch (error) {
        console.error('Error in login:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/register', async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            phoneNumber,
            address,
            city,
            state,
            zipCode,
            country,
        } = req.body;

        // Check if email is already in use
        const existingUserByEmail = await userModel.getUserByEmail(email);
        if (existingUserByEmail) {
            return res.status(400).json({ error: 'Email is already in use' });
        }

        // Check if name is already in use
        const existingUserByName = await userModel.getUserByName(name);
        if (existingUserByName) {
            return res.status(400).json({ error: 'Name is already in use' });
        }

        // Create new user with default role 'user'
        const userId = await userModel.createUser(
            name,
            email,
            password,
            phoneNumber,
            address,
            city,
            state,
            zipCode,
            country,
            'user' // default role
        );
        res.json({ success: true, message: 'User created successfully' });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/hello', (req, res) => {
    res.json({ message: 'Hello, world!' });
});

module.exports = router;
