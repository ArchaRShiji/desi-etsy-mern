const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Order = require('../models/Order');

// Get artisan orders
router.get('/artisan/:artisanId/orders', authMiddleware, async (req, res) => {
  try {
    if (req.user.id !== req.params.artisanId && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Forbidden' });
    }

    const orders = await Order.find({ artisanId: req.params.artisanId })
      .populate('productId', 'name')
      .populate('buyerId', 'name')
      .lean();

    const formattedOrders = orders.map(order => ({
      _id: order._id,
      productName: order.productId.name,
      quantity: order.quantity,
      buyerName: order.buyerId.name,
      status: order.status,
      createdAt: order.createdAt,
    }));

    res.json({ orders: formattedOrders });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update order status
router.put('/orders/:orderId/status', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Packed', 'Shipped', 'Delivered', 'Cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ msg: 'Invalid status value' });
    }

    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ msg: 'Order not found' });

    if (order.artisanId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Forbidden' });
    }

    order.status = status;
    await order.save();

    res.json({ msg: 'Order status updated', order });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Create new order
router.post('/orders', authMiddleware, async (req, res) => {
  try {
    const { productId, artisanId, quantity } = req.body;
    const buyerId = req.user.id;

    if (!productId || !artisanId || !quantity) {
      return res.status(400).json({ msg: 'Missing required fields' });
    }

    const newOrder = new Order({
      productId,
      artisanId,
      buyerId,
      quantity,
      status: 'Pending'
    });

    const savedOrder = await newOrder.save();
    res.status(201).json({ msg: 'Order created successfully', order: savedOrder });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error while creating order' });
  }
});


module.exports = router;
