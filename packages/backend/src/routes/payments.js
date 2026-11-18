// payments routes: paystack + hubtel (basic integration)
const express = require('express');
const crypto = require('crypto');
const { initializeTransaction, verifyTransaction } = require('../services/paystack');
const Order = require('../models/Order');
const WalletTransaction = require('../models/WalletTransaction');
const { settleWalletFunding } = require('../services/wallet');

const router = express.Router();

// Initialize Paystack transaction for an existing order
router.post('/paystack/initialize', express.json(), async (req, res) => {
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

router.post('/paystack/verify', express.json(), async (req, res) => {
  try {
    const { reference } = req.body || {};
    if (!reference) return res.status(400).json({ error: 'reference required' });

    const verification = await verifyTransaction(reference);
    if (!verification) return res.status(502).json({ error: 'Paystack verification failed' });

    const order = await Order.findOne({ orderId: reference });
    if (!order) return res.status(404).json({ error: 'Order not found' });

    if (verification.status === 'success') {
      if (
        Number(verification.amount) !== Math.round(order.amount * 100) ||
        String(verification.currency || '').toUpperCase() !== order.currency
      ) {
        order.paymentStatus = 'FAILED';
        order.orderStatus = 'FAILED';
        order.failureReason = 'Payment amount or currency mismatch';
        await order.save();
        return res.status(400).json({ error: 'Payment amount or currency mismatch', order });
      }
      order.paymentStatus = 'PAID';
      order.orderStatus = 'PAID';
      order.paidAt = new Date();
      order.providerPaymentId = verification.id ? String(verification.id) : reference;
      await order.save();
    } else {
      order.paymentStatus = 'FAILED';
      order.orderStatus = 'FAILED';
      await order.save();
    }

    return res.json({ ok: true, order });
  } catch (err) {
    console.error('Paystack verify error:', err.message || err);
    return res.status(500).json({ error: err.message || 'Paystack verification failed' });
  }
});

// Paystack webhook - must verify signature using raw body
router.post('/paystack/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || '';
    const signature = req.headers['x-paystack-signature'];
    const rawBody = req.body;
    if (typeof signature !== 'string' || !PAYSTACK_SECRET_KEY || !Buffer.isBuffer(rawBody)) {
      console.warn('Missing signature or PAYSTACK_SECRET_KEY');
      return res.status(400).end();
    }

    const computed = crypto.createHmac('sha512', PAYSTACK_SECRET_KEY).update(rawBody).digest('hex');
    const computedBuffer = Buffer.from(computed, 'hex');
    const signatureBuffer = Buffer.from(signature, 'hex');
    if (
      computedBuffer.length !== signatureBuffer.length ||
      !crypto.timingSafeEqual(computedBuffer, signatureBuffer)
    ) {
      console.warn('Invalid Paystack signature');
      return res.status(400).end();
    }

    const payload = JSON.parse(rawBody.toString('utf8'));
    const event = payload.event;
    const data = payload.data || {};
    const reference = data.reference;

    if (!reference || !['charge.success', 'charge.failed'].includes(event)) {
      return res.json({ received: true });
    }

    const walletFunding = await WalletTransaction.findOne({ reference });
    if (walletFunding) {
      await settleWalletFunding(reference, data);
      return res.json({ received: true });
    }

    const order = await Order.findOne({ orderId: reference });
    if (!order) return res.json({ received: true });

    const paymentSucceeded = event === 'charge.success'
      && data.status === 'success'
      && Number(data.amount) === Math.round(order.amount * 100)
      && String(data.currency || '').toUpperCase() === order.currency;

    if (paymentSucceeded) {
      order.paymentStatus = 'PAID';
      order.orderStatus = 'PAID';
      order.paidAt = new Date();
      order.providerPaymentId = data.id ? String(data.id) : reference;
    } else {
      order.paymentStatus = 'FAILED';
      order.orderStatus = 'FAILED';
      order.failureReason = event === 'charge.success'
        ? 'Payment amount or currency mismatch'
        : 'Payment was not successful';
    }
    await order.save();

    return res.json({ received: true });
  } catch (err) {
    console.error('Paystack webhook handling error', err);
    res.status(500).end();
  }
});

// Hubtel integration (basic/sandbox placeholder)
router.post('/hubtel/initialize', express.json(), async (req, res) => {
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

    if (status === 'success') {
      order.paymentStatus = 'PAID';
      order.orderStatus = 'PAID';
      order.paidAt = new Date();
    } else {
      order.paymentStatus = 'FAILED';
      order.orderStatus = 'FAILED';
    }
    await order.save();

    res.json({ ok: true, order });
  } catch (err) {
    console.error('Hubtel webhook error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
