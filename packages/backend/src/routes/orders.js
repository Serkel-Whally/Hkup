const express = require('express');
const { v4: uuid } = require('uuid');
const Bundle = require('../models/Bundle');
const Order = require('../models/Order');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const {
      network,
      bundleId,
      bundleSize,
      validity,
      recipientPhone,
      paymentMethod = 'Wallet',
      paymentProvider = null,
    } = req.body || {};

    if (!network || !recipientPhone || !bundleSize) {
      return res.status(400).json({ error: 'network, bundleSize and recipientPhone are required' });
    }

    const bundle = bundleId
      ? await Bundle.findOne({ bundleId, active: true })
      : await Bundle.findOne({ network, size: bundleSize, active: true }).sort({ price: 1 });

    if (!bundle) {
      return res.status(404).json({ error: 'Bundle not found' });
    }

    const normalizedRecipient = String(recipientPhone).replace(/\s+/g, '').trim();
    if (!/^(?:0[2-9]\d{8}|(?:\+?233)[2-9]\d{8})$/.test(normalizedRecipient)) {
      return res.status(400).json({ error: 'Invalid recipient phone number' });
    }

    const orderId = `CLD-${Date.now()}-${uuid().slice(0, 8).toUpperCase()}`;
    let userId = null;
    const authorization = req.headers.authorization || '';
    if (authorization.startsWith('Bearer ')) {
      try {
        const jwt = require('jsonwebtoken');
        const payload = jwt.verify(authorization.slice(7), process.env.JWT_SECRET || 'change_this_secret');
        userId = payload.sub;
      } catch (_) {}
    }

    const order = new Order({
      orderId,
      userId,
      planId: bundle.bundleId || null,
      bundleId: bundle.bundleId,
      network: bundle.network,
      bundleSize: bundle.size,
      validity: bundle.validity,
      recipientPhone,
      amount: bundle.price,
      currency: 'GHS',
      paymentStatus: 'PENDING',
      orderStatus: 'AWAITING_PAYMENT',
      paymentMethod,
      paymentProvider,
    });

    await order.save();
    res.status(201).json({ order });
  } catch (err) {
    console.error('Create order error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/', requireAuth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 }).lean();
    res.json({ orders });
  } catch (err) {
    console.error('List orders error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:orderId', requireAuth, async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId }).lean();
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (String(order.userId) !== String(req.user._id)) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (err) {
    console.error('Get order error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
