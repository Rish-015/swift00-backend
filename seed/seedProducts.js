const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Product = require('../models/product.model');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('Connected to MongoDB for seeding...');

  await Product.deleteMany(); // Clear old data

  const products = [
    {
      name: "20-Litre Refilled RO Water",
      price: 20,
      description: "RO-purified drinking water delivered to your doorstep.",
      stock: 15,
      image: "", // no image URL provided
    },
    {
      name: "20-Litre Branded Drinking Water",
      price: 45,
      description: "BIS-certified, safe daily use.",
      stock: 7,
      image: "", // no image URL provided
    },
    {
      name: "20-Litre Premium Branded Water",
      price: 85,
      description: "Top-tier brands. Premium water with RO + UV + Ozonation.",
      stock: 3,
      image: "", // no image URL provided
    },
  ];

  await Product.insertMany(products);
  console.log("✅ Products seeded successfully!");
  mongoose.disconnect();
})
.catch((err) => console.error("❌ Seed error:", err));
