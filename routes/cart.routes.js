console.log('cart.routes.js loaded');
const express = require('express');
const router = express.Router();
const { getCart, saveCart } = require('../controllers/cart.controller');
const auth = require('../middleware/auth'); // You should have an auth middleware for token verification

router.get('/', auth, getCart);
router.post('/', auth, saveCart);

// Test route to verify cart route registration
router.get('/test', (req, res) => res.send('Cart route is working!'));

module.exports = router;
