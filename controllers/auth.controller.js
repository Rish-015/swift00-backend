// controllers/auth.controller.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/user.model');
const Cart = require('../models/cart.model');   // only if you're using Cart
const Order = require('../models/order.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ✅ Signup logic
const signup = async (req, res) => {
  try {
    const { username, password, email, phone } = req.body;

    // ✅ Validate required fields
    if (!username || !password || !email || !phone) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // ✅ Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: 'Username already exists' });

    

    // ✅ Create and save user
    const newUser = new User({ username, password, email, phone });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully', userId: newUser._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Signup failed', error: err.message });
  }
};

// ✅ Login logic
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // ✅ Validate required fields
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // ✅ Find user
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Invalid username or password' });

    // ✅ Compare password
    const isMatch = await user.comparePassword(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid username or password' });

    // ✅ Generate JWT
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};
const deleteAccount = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user id' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await Cart.deleteOne({ userId }).catch(() => {});
    await Order.deleteMany({ userId }).catch(() => {});

    await user.deleteOne();

    return res.status(200).json({ message: 'Account deleted successfully' });
  } catch (err) {
    console.error('Delete account error:', err);
    return res
      .status(500)
      .json({ message: 'Failed to delete account', error: err.message });
  }
};

// ✅ Export all functions correctly
module.exports = {
  signup,
  login,
  deleteAccount
};