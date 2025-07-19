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

// routes/order.routes.js
router.put('/mark-delivered/:orderId/:productName', async (req, res) => {
  const { orderId, productName } = req.params;

  try {
    const order = await Order.findById(orderId);
    const item = order.cartItems.find(item => item.name === productName);
    
    if (item) {
      item.delivered = true;
      await order.save();
      res.json({ message: `Marked ${productName} as delivered.` });
    } else {
      res.status(404).json({ error: 'Product not found in cartItems' });
    }

  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;
