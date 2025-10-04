
const Product = require('../models/product.model'); // ✅ Ensure this is at the top
const cloudinary = require('../cloudinary');
const fs = require('fs');

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    const mappedProducts = products.map(product => {
      const prod = product.toObject();
      // Always use Cloudinary URL directly
      prod.imageUrl = prod.image || '';
      return prod;
    });
    res.json(mappedProducts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products' });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const prod = product.toObject();
    // Always use Cloudinary URL directly
    prod.imageUrl = prod.image || '';
    prod.stock = product.stock;
    res.json(prod);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: 'Error fetching product' });
  }
};


const createProduct = async (req, res) => {
  try {
    const { name, price, description, stock } = req.body;
    let imageUrl = '';
    if (req.file) {
      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'products',
      });
      imageUrl = result.secure_url;
      // Remove local file after upload
      fs.unlinkSync(req.file.path);
    }
    const product = new Product({ name, price, description, image: imageUrl, stock });
    await product.save();
    // Add imageUrl to response
    const prod = product.toObject();
    prod.imageUrl = prod.image;
    res.status(201).json(prod);
  } catch (err) {
    res.status(500).json({ message: 'Error creating product', error: err.message });
  }
};


const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, description, stock } = req.body;
  let updateFields = { name, price, description, stock };
  if (req.file) {
    // Upload new image to Cloudinary
    try {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'products',
      });
      updateFields.image = result.secure_url;
      fs.unlinkSync(req.file.path);
    } catch (err) {
      return res.status(500).json({ message: 'Image upload failed', error: err.message });
    }
  }
  try {
    const updated = await Product.findByIdAndUpdate(
      id,
      updateFields,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Product not found' });
    const prod = updated.toObject();
    prod.imageUrl = prod.image || '';
    res.json(prod);
  } catch (error) {
    res.status(500).json({ message: 'Server error while updating product' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product' });
  }
};

// ✅ Correct export!
module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
