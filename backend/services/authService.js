const User = require('../models/User');
const jwt = require('jsonwebtoken');

class AuthService {
  static async register({ username, email, password }) {
    // Input validation
    if (!username || typeof username !== 'string' || username.trim().length < 3) {
      const err = new Error('Username is required and must be at least 3 characters.');
      err.status = 400;
      throw err;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== 'string' || !emailRegex.test(email)) {
      const err = new Error('A valid email is required.');
      err.status = 400;
      throw err;
    }
    if (!password || typeof password !== 'string' || password.length < 6) {
      const err = new Error('Password is required and must be at least 6 characters.');
      err.status = 400;
      throw err;
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      const err = new Error('User already exists');
      err.status = 400;
      throw err;
    }

    const user = await User.create({ username, email, password });
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    return {
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin
      }
    };
  }
}

module.exports = AuthService;
