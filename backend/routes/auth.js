const express = require('express');
const AuthService = require('../services/authService');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const result = await AuthService.register({ username, email, password });
    res.status(201).json({
      status: 'success',
      token: result.token,
      data: { user: result.user }
    });
  } catch (error) {
    const status = error.status || 400;
    res.status(status).json({ message: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }
    
    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({ message: 'Incorrect email or password' });
    }
    
    const token = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    
    res.status(200).json({
      status: 'success',
      token,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          isAdmin: user.isAdmin
        }
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;