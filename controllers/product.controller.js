const Product = require('../models/product.model'); // ✅ Ensure this is at the top

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    const baseUrl = req.protocol + '://' + req.get('host');
    const mappedProducts = products.map(product => {
      const prod = product.toObject();
      prod.imageUrl = prod.image ? baseUrl + prod.image : '';
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

    const baseUrl = req.protocol + '://' + req.get('host');

    const prod = product.toObject();

    // ✅ Add image URL
    prod.imageUrl = prod.image ? baseUrl + prod.image : '';

    // ✅ Ensure stock is included in response
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
    let imagePath = req.file ? `/images/${req.file.filename}` : '';
    const product = new Product({ name, price, description, image: imagePath, stock });
    await product.save();
    // Add imageUrl to response
    const baseUrl = req.protocol + '://' + req.get('host');
    const prod = product.toObject();
    prod.imageUrl = prod.image ? baseUrl + prod.image : '';
    res.status(201).json(prod);
  } catch (err) {
    res.status(500).json({ message: 'Error creating product' });
  }
};


const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, description, stock } = req.body;
  let updateFields = { name, price, description, stock };
  if (req.file) {
    updateFields.image = `/images/${req.file.filename}`;
  }
  try {
    const updated = await Product.findByIdAndUpdate(
      id,
      updateFields,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Product not found' });
    // Add imageUrl to response
    const baseUrl = req.protocol + '://' + req.get('host');
    const prod = updated.toObject();
    prod.imageUrl = prod.image ? baseUrl + prod.image : '';
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
