const express = require('express');
const { v4: uuid } = require('uuid');
const Bundle = require('../models/Bundle');
const Order = require('../models/Order');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const {
      userId = null,
      network,
      bundleId,
      bundleSize,
      validity,
      recipientPhone,
      amount,
      paymentMethod = 'Wallet',
      paymentProvider = null,
    } = req.body || {};

    if (!network || !recipientPhone || !bundleSize || amount === undefined || amount === null) {
      return res.status(400).json({ error: 'network, bundleSize, recipientPhone and amount are required' });
    }

    const bundle = bundleId
      ? await Bundle.findOne({ bundleId, active: true })
      : await Bundle.findOne({ network, size: bundleSize, active: true }).sort({ price: 1 });

    if (!bundle) {
      return res.status(404).json({ error: 'Bundle not found' });
    }

    const normalizedAmount = Number(amount);
    if (Number.isNaN(normalizedAmount) || normalizedAmount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const orderId = `CLD-${Date.now()}-${uuid().slice(0, 8).toUpperCase()}`;

    const order = new Order({
      orderId,
      userId,
      planId: bundle.bundleId || null,
      bundleId: bundle.bundleId,
      network: bundle.network,
      bundleSize: bundle.size,
      validity: bundle.validity,
      recipientPhone,
      amount: normalizedAmount,
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

router.get('/:orderId', async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId }).lean();
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    console.error('Get order error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
