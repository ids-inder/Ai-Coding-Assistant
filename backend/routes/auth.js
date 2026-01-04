const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    console.log('[1] Registration started');
    const { username, email, password } = req.body;

    console.log('[2] Validating input');
    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    console.log('[3] Checking existing user');
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      console.log('[4] User already exists, returning error');
      return res.status(400).json({ error: 'User already exists' });
    }

    console.log('[5] Creating new user object');
    // Create new user
    const user = new User({
      username,
      email,
      password
    });

    console.log('[6] Saving user to database');
    await user.save();
    console.log('[7] User saved successfully');

    console.log('[8] Creating JWT token');
    // Create token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('[9] Sending response');
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
    console.log('[10] Response sent successfully');
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Error registering user' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    console.log('[L1] Login started');
    const { email, password } = req.body;

    console.log('[L2] Validating input');
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password' });
    }

    console.log('[L3] Finding user');
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      console.log('[L4] User not found');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log('[L5] Comparing password');
    // Check password
    const isMatch = await user.comparePassword(password);
    console.log('[L6] Password comparison complete, match:', isMatch);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log('[L7] Updating last login');
    // Update last login
    user.lastLogin = new Date();
    await user.save();
    console.log('[L8] Last login updated');

    console.log('[L9] Creating JWT token');
    // Create token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('[L10] Sending response');
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
    console.log('[L11] Login response sent successfully');
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Error logging in' });
  }
});

// Verify token
router.get('/verify', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;
