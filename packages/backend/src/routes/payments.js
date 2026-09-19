// payments routes: paystack + hubtel (basic integration)
const express = require('express');
const crypto = require('crypto');
const { initializeTransaction } = require('../services/paystack');
const Order = require('../models/Order');

const router = express.Router();

// Initialize Paystack transaction for an existing order
router.post('/paystack/initialize', async (req, res) => {
  try {
    const { orderId, email, callback_url } = req.body || {};
    if (!orderId) return res.status(400).json({ error: 'orderId required' });

    const order = await Order.findOne({ orderId });
    if (!order) return res.status(404).json({ error: 'Order not found' });

    const data = await initializeTransaction({ email: email || 'guest@whally.local', amount: order.amount, reference: order.orderId, callback_url });
    return res.json({ ok: true, data });
  } catch (err) {
    console.error('Paystack init error:', err.message || err);
    return res.status(500).json({ error: err.message || 'Paystack init failed' });
  }
});

// Paystack webhook - must verify signature using raw body
router.post('/paystack/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || '';
    const signature = req.headers['x-paystack-signature'];
    const rawBody = req.body; // Buffer
    if (!signature || !PAYSTACK_SECRET_KEY) {
      console.warn('Missing signature or PAYSTACK_SECRET_KEY');
      return res.status(400).end();
    }

    const computed = crypto.createHmac('sha512', PAYSTACK_SECRET_KEY).update(rawBody).digest('hex');
    if (computed !== signature) {
      console.warn('Invalid Paystack signature');
      return res.status(400).end();
    }

    const payload = JSON.parse(rawBody.toString('utf8'));
    // Handle event
    const event = payload.event || payload.event;
    const data = payload.data || payload;
    const reference = data.reference || (data && data.tx_ref) || null;

    if (reference) {
      const order = await Order.findOne({ orderId: reference });
      if (order) {
        const status = data.status || data.gateway_response || 'success';
        if (status === 'success' || data.status === 'success') {
          order.status = 'paid';
          order.paidAt = new Date();
          order.providerPaymentId = data.id || data.reference || null;
          await order.save();
        } else {
          order.status = 'failed';
          await order.save();
        }
      }
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Paystack webhook handling error', err);
    res.status(500).end();
  }
});

// Hubtel integration (basic/sandbox placeholder)
router.post('/hubtel/initialize', async (req, res) => {
  // Hubtel integration requires API credentials; this is a simplified placeholder
  try {
    const { orderId, callback_url } = req.body || {};
    if (!orderId) return res.status(400).json({ error: 'orderId required' });
    const order = await Order.findOne({ orderId });
    if (!order) return res.status(404).json({ error: 'Order not found' });

    // In a real implementation, call Hubtel API to create a payment request.
    // For now, return a simulated redirect URL that indicates how to swap in real behavior.
    return res.json({ ok: true, data: { provider: 'hubtel', redirect_url: `https://hubtel.example/pay/${orderId}`, reference: orderId } });
  } catch (err) {
    console.error('Hubtel init error', err);
    res.status(500).json({ error: 'Hubtel init failed' });
  }
});

// Hubtel webhook placeholder: verify using configured secret if available
router.post('/hubtel/webhook', express.json(), async (req, res) => {
  try {
    // Hubtel webhook signature verification would go here (provider docs)
    const { orderId, status = 'success' } = req.body || {};
    if (!orderId) return res.status(400).json({ error: 'orderId required' });
    const order = await Order.findOne({ orderId });
    if (!order) return res.status(404).json({ error: 'Order not found' });

    order.status = status === 'success' ? 'paid' : 'failed';
    if (order.status === 'paid') order.paidAt = new Date();
    await order.save();

    res.json({ ok: true, order });
  } catch (err) {
    console.error('Hubtel webhook error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
