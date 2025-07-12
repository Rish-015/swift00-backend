const Order = require('../models/order.model');
const User = require('../models/user.model');
const mongoose = require('mongoose');

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartItems,
      customerDetails,
      dispatchDate,
      dispatchTime,
      paymentMethod,
      paymentStatus,
      totalAmount,
      paymentId
    } = req.body;

    console.log('Order received:', req.body);

    const newOrder = new Order({
      userId,
      cartItems,
      customerInfo: customerDetails,
      dispatchDetails: { date: dispatchDate, time: dispatchTime },
      paymentMethod,
      paymentStatus,
      totalAmount,
      paymentId,
      status: 'Placed',
      createdAt: new Date(),
    });
    const saved = await newOrder.save();

    // Reduce stock for each product in the order
    for (const item of cartItems) {
      await require('../models/product.model').updateOne(
        { name: item.name },
        { $inc: { stock: -item.quantity } }
      );
    }

    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all orders (Admin use)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    // Transform orders to match frontend expectations
    const formattedOrders = orders.map(order => ({
      _id: order._id,
      customerName: order.customerInfo?.name || '',
      customerPhone: order.customerInfo?.phone || '',
      items: (order.cartItems || []).map(item => ({
        name: item.name,
        quantity: item.quantity
      })),
      total: order.totalAmount,
      paymentMethod: order.paymentMethod || '',
      dispatchDetails: order.dispatchDetails ? `${order.dispatchDetails.date || ''} ${order.dispatchDetails.time || ''}`.trim() : '',
      createdAt: order.createdAt,
      status: order.status || '',
      address: order.customerInfo?.address || '',
      gpsLocation: order.customerInfo?.gpsLocation || '',
    }));
    res.status(200).json(formattedOrders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve orders' });
  }
};

// Get orders for a specific user
// exports.getUserOrders = async (req, res) => {
//   try {
//     const userId = req.params.userId;
//     const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
//     res.status(200).json(orders);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to retrieve user orders' });
//   }
// };
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.params.userId;
    const objectUserId = new mongoose.Types.ObjectId(userId);
    const orders = await Order.find({ userId: objectUserId }).sort({ createdAt: -1 });
    // Only return cartItems and status fields as expected by frontend
    const formattedOrders = orders.map(order => ({
      cartItems: order.cartItems || [],
      total: order.totalAmount,
      createdAt: order.createdAt,
      status: order.status || 'Ordered'
    }));
    res.status(200).json(formattedOrders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve user orders' });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { $set: { status } },
      { new: true }
    );
    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.status(200).json({ message: 'Order status updated', order: {
      _id: updatedOrder._id,
      customerName: updatedOrder.customerInfo?.name || '',
      customerPhone: updatedOrder.customerInfo?.phone || '',
      items: (updatedOrder.cartItems || []).map(item => ({
        name: item.name,
        quantity: item.quantity
      })),
      total: updatedOrder.totalAmount,
      paymentMethod: updatedOrder.paymentMethod || '',
      dispatchDetails: updatedOrder.dispatchDetails ? `${updatedOrder.dispatchDetails.date || ''} ${updatedOrder.dispatchDetails.time || ''}`.trim() : '',
      createdAt: updatedOrder.createdAt,
      status: updatedOrder.status || ''
    }});
  } catch (err) {
    res.status(500).json({ error: 'Failed to update order status' });
  }
};
