const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Product = require('../models/Product');

//Setup multer middleware
const multer = require('multer');
const path = require('path');

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // make sure this folder exists or create it
  },
  filename: function (req, file, cb) {
    // unique filename: timestamp + original name
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// File filter to allow images only (optional)
function fileFilter(req, file, cb) {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only images are allowed'));
  }
}

const upload = multer({ storage, fileFilter });


// Get all products for an artisan
router.get('/artisan/:artisanId/products', authMiddleware, async (req, res) => {
  try {
    if (req.user.id !== req.params.artisanId && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Forbidden' });
    }
    const products = await Product.find({ artisanId: req.params.artisanId });
    res.json({ products });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Add product
// upload.array('images', 5) => Accept up to 5 images with field name 'images'
router.post('/artisan/:artisanId/products', authMiddleware, upload.single('images'), async (req, res) => {
  try {
    if (req.user.id !== req.params.artisanId) {
      return res.status(403).json({ msg: 'Forbidden' });
    }

    const { name, price, description, category, stock, tags } = req.body;

    // Get uploaded file names
    const images = req.file ? [req.file.filename] : [];

    const newProduct = new Product({
      name,
      price,
      description,
      category,
      stock,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [], // convert comma-separated tags string to array
      images,
      artisanId: req.params.artisanId,
      isApproved: false,
    });

    await newProduct.save();
    res.status(201).json({ msg: 'Product added', product: newProduct });
  } catch (err) {
    console.error("Error saving product:", err);
    res.status(500).json({ msg: 'Server error' });
  }
});


// Update product
router.put('/products/:productId', authMiddleware, upload.single('images'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json({ msg: 'Product not found' });
    if (product.artisanId.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Forbidden' });
    }

    const { name, price, description, category, stock, tags } = req.body;

    product.name = name;
    product.price = price;
    product.description = description;
    product.category = category;
    product.stock = stock;
    product.tags = tags ? tags.split(',').map(tag => tag.trim()) : product.tags;

    // If new images uploaded, replace old images
    if (req.file) {
      product.images = [req.file.filename];
    }

    // Reset approval when edited
    product.isApproved = false;

    await product.save();
    res.json({ msg: 'Product updated', product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});


// Delete product
router.delete('/products/:productId', authMiddleware, async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json({ msg: 'Product not found' });
    if (product.artisanId.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Forbidden' });
    }
    await product.deleteOne();
    res.json({ msg: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET all approved products by approved artisans
router.get('/products/approved-products', async (req, res) => {
  try {
    const approvedProducts = await Product.find({ isApproved: true })
      .populate({
        path: 'artisanId',
        match: { isApproved: true }, // filter only approved artisans
        select: 'name' // optionally limit artisan fields
      });

    // filter out products with no artisan (i.e., not approved)
    const filteredProducts = approvedProducts.filter(p => p.artisanId !== null);

    res.json({ products: filteredProducts });
  } catch (err) {
    console.error("Error fetching approved products:", err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Search products
router.get('/products/search', async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim() === "") {
      return res.status(400).json({ msg: "Search query is required" });
    }

    // Case-insensitive partial match on name, description, category, and tags
    const products = await Product.find({
      isApproved: true,
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } },
        { tags: { $regex: q, $options: 'i' } }
      ]
    }).populate({
      path: 'artisanId',
      match: { isApproved: true },
      select: 'name'
    });

    // Filter products with approved artisans
    const filtered = products.filter(p => p.artisanId !== null);

    res.json({ products: filtered });
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});


// Get single product by ID
router.get('/products/:productId', async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId).populate('artisanId', 'name');
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }
    res.json({ product });
  } catch (err) {
    console.error("Error fetching product:", err);
    res.status(500).json({ msg: 'Server error' });
  }
});


module.exports = router;
