const Cart = require('../models/cart.model');
const Product = require('../models/product.model');

// GET /cart - get current user's cart with product details
exports.getCart = async (req, res) => {
  console.log('GET /api/cart called', req.headers);
  try {
    if (!req.user || (!req.user._id && !req.user.userId)) {
      console.error('No user in req.user:', req.user);
      return res.status(401).json({ message: 'Invalid or missing user in token' });
    }
    const userId = req.user._id || req.user.userId;
    const cart = await Cart.findOne({ userId });
    if (!cart || !cart.items.length) return res.json([]);

    // Fetch product details for each cart item
    const productIds = cart.items.map(item => item.productId);
    const products = await Product.find({ _id: { $in: productIds } });
    const baseUrl = req.protocol + '://' + req.get('host');

    const items = cart.items.map(item => {
      const product = products.find(p => p._id.equals(item.productId));
      if (!product) {
        console.error('Product not found for cart item:', item.productId);
      }
      return {
        productId: item.productId,
        name: product ? product.name : '',
        price: product ? product.price : 0,
        quantity: item.quantity,
        image: product ? (product.image || '') : ''
      };
    });
    res.json(items);
  } catch (err) {
    console.error('Cart fetch error:', err);
    res.status(500).json({ message: 'Error fetching cart', error: err.message });
  }
};

// POST /cart - save/overwrite current user's cart
exports.saveCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const items = req.body.items || [];
    await Cart.findOneAndUpdate(
      { userId },
      { items, updatedAt: new Date() },
      { upsert: true, new: true }
    );
    res.json({ message: 'Cart saved' });
  } catch (err) {
    res.status(500).json({ message: 'Error saving cart' });
  }
};
