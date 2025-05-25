// backend/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');

// Fetch all pending artisans
router.get('/admin/artisans/pending', async (req, res) => {
  try {
    const pendingArtisans = await User.find({ role: 'artisan', isApproved: false });
    res.json(pendingArtisans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Approve artisan
router.post('/admin/artisans/approve/:id', async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { isApproved: true });
    res.json({ message: 'Artisan approved' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reject artisan
router.post('/admin/artisans/reject/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Artisan rejected' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch all pending products
router.get('/admin/products/pending', async (req, res) => {
  try {
    const pendingProducts = await Product.find({ isApproved: false });
    res.json(pendingProducts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Approve product
router.post('/admin/products/approve/:id', async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, { isApproved: true });
    res.json({ message: 'Product approved' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reject product
router.post('/admin/products/reject/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product rejected' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
