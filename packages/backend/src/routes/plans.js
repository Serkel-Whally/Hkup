const express = require('express');
const { v4: uuid } = require('uuid');
const Plan = require('../models/Plan');
const Order = require('../models/Order');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const plans = await Plan.find({ active: true }).sort({ price: 1 }).lean();
    res.json(plans);
  } catch (err) {
    console.error('List plans error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { id, title, description, price, currency = 'GHS', validityDays = 30 } = req.body || {};
    if (!id || !title || price === undefined || price === null) {
      return res.status(400).json({ error: 'id, title and price required' });
    }

    const existing = await Plan.findOne({ id });
    if (existing) {
      return res.status(409).json({ error: 'Plan already exists' });
    }

    const plan = new Plan({ id, title, description, price, currency, validityDays, active: true });
    await plan.save();
    res.status(201).json(plan);
  } catch (err) {
    console.error('Create plan error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/orders', async (req, res) => {
  try {
    const {
      userId = null,
      network,
      bundleSize,
      validity,
      recipientPhone,
      amount,
      paymentMethod = 'Wallet',
      paymentProvider = null,
      planId = null,
    } = req.body || {};

    if (!network || !bundleSize || !recipientPhone || amount === undefined || amount === null) {
      return res.status(400).json({ error: 'network, bundleSize, recipientPhone and amount are required' });
    }

    const sanitizedAmount = Number(amount);
    if (Number.isNaN(sanitizedAmount) || sanitizedAmount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const orderId = `CLD-${Date.now()}-${uuid().slice(0, 8).toUpperCase()}`;

    const order = new Order({
      orderId,
      userId,
      planId,
      network,
      bundleSize,
      validity,
      recipientPhone,
      amount: sanitizedAmount,
      currency: 'GHS',
      paymentStatus: 'PENDING',
      orderStatus: 'AWAITING_PAYMENT',
      paymentMethod,
      paymentProvider,
    });

    await order.save();

    res.status(201).json({
      order,
      payment: {
        provider: paymentProvider || paymentMethod,
        redirectUrl: `/payment/${orderId}`,
      },
    });
  } catch (err) {
    console.error('Create order error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/payments/webhook', async (req, res) => {
  try {
    const { orderId, status = 'success', paymentProvider = null } = req.body || {};
    if (!orderId) return res.status(400).json({ error: 'orderId required' });

    const order = await Order.findOne({ orderId });
    if (!order) return res.status(404).json({ error: 'Order not found' });

    const normalizedStatus = String(status).toLowerCase();
    const isSuccess = normalizedStatus === 'success' || normalizedStatus === 'paid';

    order.paymentStatus = isSuccess ? 'PAID' : 'FAILED';
    order.orderStatus = isSuccess ? 'PAID' : 'FAILED';
    order.paymentProvider = paymentProvider || order.paymentProvider;

    if (isSuccess) {
      order.paidAt = new Date();
    } else {
      order.failureReason = 'Payment verification failed';
    }

    await order.save();

    return res.json({ ok: true, order });
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/orders/:orderId', async (req, res) => {
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
