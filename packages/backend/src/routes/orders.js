const express = require('express');
const { v4: uuid } = require('uuid');
const Bundle = require('../models/Bundle');
const Order = require('../models/Order');
const { requireAuth } = require('../middleware/auth');
const { normalizeGhanaPhone } = require('../services/payment-safety');

const router = express.Router();

// Orders belong to an authenticated customer. Prices and bundle details are
// always loaded from the database; client-supplied totals are never trusted.
router.post('/', requireAuth, async (req, res) => {
  try {
    const {
      bundleId,
      network,
      bundleSize,
      recipientPhone,
      paymentMethod = 'Card',
      paymentProvider = 'Paystack',
    } = req.body || {};

    if (!bundleId || !recipientPhone) {
      return res.status(400).json({ error: 'bundleId and recipientPhone are required' });
    }
    if (paymentProvider !== 'Paystack' || !['Card', 'Mobile Money'].includes(paymentMethod)) {
      return res.status(400).json({ error: 'Unsupported payment method' });
    }

    const bundle = await Bundle.findOne({ bundleId, active: true }).lean();
    if (!bundle) return res.status(404).json({ error: 'Bundle not found or unavailable' });
    if (network && network !== bundle.network) {
      return res.status(400).json({ error: 'Selected network does not match this bundle' });
    }
    if (bundleSize && bundleSize !== bundle.size) {
      return res.status(400).json({ error: 'Selected bundle size does not match this bundle' });
    }

    const normalizedRecipient = normalizeGhanaPhone(recipientPhone);
    if (!normalizedRecipient) {
      return res.status(400).json({ error: 'Invalid recipient phone number' });
    }

    const orderId = `HKUP-${Date.now()}-${uuid().slice(0, 8).toUpperCase()}`;
    const order = await Order.create({
      orderId,
      userId: req.user._id,
      planId: bundle.bundleId,
      bundleId: bundle.bundleId,
      network: bundle.network,
      bundleSize: bundle.size,
      validity: bundle.validity,
      recipientPhone: normalizedRecipient,
      amount: bundle.price,
      currency: 'GHS',
      paymentStatus: 'PENDING',
      orderStatus: 'AWAITING_PAYMENT',
      paymentMethod,
      paymentProvider,
    });

    return res.status(201).json({ order });
  } catch (err) {
    console.error('Create order error:', err);
    return res.status(500).json({ error: 'Server error' });
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
    const order = await Order.findOne({ orderId: req.params.orderId, userId: req.user._id }).lean();
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    console.error('Get order error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
