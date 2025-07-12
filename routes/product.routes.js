const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Multer config for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/images'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// ✅ Import controller functions
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,    // <-- this line is crucial
  deleteProduct,
} = require('../controllers/product.controller');


router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', upload.single('image'), createProduct); // Accept image upload
router.patch('/:id', upload.single('image'), updateProduct); // Accept image upload
router.delete('/:id', deleteProduct);
// product.routes.js

router.get('/product-prices', async (req, res) => {
  try {
    const products = await Product.find({}, 'id price originalPrice');
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch prices' });
  }
});


module.exports = router;


// controllers/product.controller.js




