// routes/authRoutes.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

const jwtSecret = process.env.APP_SECRET || 'your_jwt_secret_key';

// Register (Signup) Route
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the user already exists
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = new User({ username, password });

    // Save the user to the database
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // Compare password with hashed password stored in database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Create a JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      jwtSecret, // Use APP_SECRET from .env
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token: token,
      userId: user._id, // Return userId for convenience
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;