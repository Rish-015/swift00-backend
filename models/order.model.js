// backend/models/order.model.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  customerInfo: {
    name: String,
    email: String,
    phone: String,
    address: String,
    pincode: String,
    gpsLocation: String
  },
  cartItems: [
    {
      name: String,
      price: Number,
      quantity: Number,
      image: String
    }
  ],
  dispatchDetails: {
    date: String,
    time: String
  },
  paymentMethod: String,
  paymentId: String,
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Completed'],
    default: 'Pending'
  },
  totalAmount: Number,
  status: {
    type: String,
    default: 'Placed'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', orderSchema);
