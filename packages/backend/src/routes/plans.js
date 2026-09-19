const express = require('express');
const { v4: uuid } = require('uuid');
const Plan = require('../models/Plan');
const Order = require('../models/Order');

const router = express.Router();

// Public: list plans
router.get('/', async (req, res) => {
  const plans = await Plan.find({ active: true }).sort({ createdAt: 1 }).lean();
  res.json(plans);
});

// Admin create plan
router.post('/', async (req, res) => {
  const { id, title, description, price, currency = 'GHS', validityDays = 30 } = req.body;
  if (!id || !title || !price) return res.status(400).json({ error: 'id, title and price required' });
  try {
    const p = new Plan({ id, title, description, price, currency, validityDays });
    await p.save();
    res.status(201).json(p);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create order (guest or authenticated)
router.post('/orders', async (req, res) => {
  const { userId = null, planId, paymentMethod = 'paystack' } = req.body || {};
  if (!planId) return res.status(400).json({ error: 'planId required' });

  const plan = await Plan.findOne({ id: planId });
  if (!plan) return res.status(404).json({ error: 'Plan not found' });

  const orderId = uuid();
  const order = new Order({ orderId, userId, planId: plan.id, amount: plan.price, currency: plan.currency, status: 'pending', paymentProvider: paymentMethod });
  await order.save();

  // In real app: create payment session and return client secret or redirect url
  res.json({ order, payment: { provider: paymentMethod, redirect_url: `https://example.com/pay/${orderId}` } });
});

// Webhook endpoint for payments
router.post('/payments/webhook', async (req, res) => {
  const { orderId, status = 'success' } = req.body || {};
  if (!orderId) return res.status(400).json({ error: 'orderId required' });

  const order = await Order.findOne({ orderId });
  if (!order) return res.status(404).json({ error: 'Order not found' });

  order.status = status === 'success' ? 'paid' : 'failed';
  if (order.status === 'paid') order.paidAt = new Date();
  await order.save();

  return res.json({ ok: true, order });
});

router.get('/orders/:orderId', async (req, res) => {
  const order = await Order.findOne({ orderId: req.params.orderId }).lean();
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
});

module.exports = router;
