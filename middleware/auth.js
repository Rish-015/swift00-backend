const jwt = require('jsonwebtoken');
require('dotenv').config();

console.log('Auth middleware loaded');
module.exports = (req, res, next) => {
  console.log('Auth middleware called', req.headers['authorization']);
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1] || authHeader;
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // decoded should contain at least _id
    next();
  } catch (err) {
    console.error('JWT error:', err);
    return res.status(401).json({ message: 'Invalid token' });
  }
};
