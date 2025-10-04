const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const dotenv = require('dotenv');
dotenv.config(); // 👈 THIS should come BEFORE accessing process.env

const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
// app.js or server.js
const orderRoutes = require('./routes/order.routes');
const cartRoutes = require('./routes/cart.routes');

const app = express();
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

// Middleware
app.set('trust proxy', 1); // if behind a proxy like Render
app.use(helmet()); // security headers
app.use(compression()); // gzip
app.use(morgan('combined'));

app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PATCH', 'DELETE'], // 👈 This line is crucial
  allowedHeaders: ['Content-Type', 'Authorization'], // <-- add 'Authorization'
}));

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Root route (optional)
app.get('/', (req, res) => {
  res.send('🎉 Backend is working fine!');
});

// Health check for platform
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// DB connection
console.log("MONGODB_URI:", process.env.MONGODB_URI); // ✅ confirm it is not undefined
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection failed:", err));

// Global error handler for uncaught errors
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

module.exports = app;
