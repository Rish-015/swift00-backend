const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');


// Create order
router.post('/create', orderController.createOrder);

// Get all orders (for admin)
router.get('/all', orderController.getAllOrders);

// Get orders by user ID
router.get('/user/:userId', orderController.getUserOrders);

// Update order status
router.patch('/:id/status', orderController.updateOrderStatus);

module.exports = router;
