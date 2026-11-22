// Payment routes: Paystack server verification and signed webhook settlement.
const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { initializeTransaction, verifyTransaction } = require('../services/paystack');
const Order = require('../models/Order');
const WalletTransaction = require('../models/WalletTransaction');
const { settleWalletFunding } = require('../services/wallet');
const { paymentMatches, isValidPaystackSignature } = require('../services/payment-safety');

const router = express.Router();

router.post('/paystack/initialize', requireAuth, express.json(), async (req, res) => {
  try {
    const { orderId, email } = req.body || {};
    if (!orderId) return res.status(400).json({ error: 'orderId required' });
    const payerEmail = String(email || req.user.email || '').trim().toLowerCase();
    if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(payerEmail)) {
      return res.status(400).json({ error: 'A valid payment email is required' });
    }

    const order = await Order.findOne({ orderId, userId: req.user._id });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (order.paymentStatus !== 'PENDING' || order.orderStatus !== 'AWAITING_PAYMENT') {
      return res.status(409).json({ error: 'This order is not awaiting payment' });
    }

    const frontendUrl = process.env.FRONTEND_URL;
    if (!frontendUrl) {
      return res.status(503).json({ error: 'Payment callback URL is not configured' });
    }
    const callbackUrl = new URL('/payment/callback', frontendUrl);
    callbackUrl.searchParams.set('reference', order.orderId);
    const data = await initializeTransaction({
      email: payerEmail,
      amount: order.amount,
      reference: order.orderId,
      callback_url: callbackUrl.toString(),
    });
    return res.json({ ok: true, data });
  } catch (err) {
    console.error('Paystack init error:', err.message || err);
    return res.status(502).json({ error: 'Paystack initialization failed' });
  }
});

router.post('/paystack/verify', requireAuth, express.json(), async (req, res) => {
  try {
    const { reference } = req.body || {};
    if (!reference) return res.status(400).json({ error: 'reference required' });

    const order = await Order.findOne({ orderId: reference, userId: req.user._id });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (order.paymentStatus === 'PAID') return res.json({ ok: true, order });

    const verification = await verifyTransaction(reference);
    if (!verification) return res.status(502).json({ error: 'Paystack verification failed' });
    if (String(verification.reference || '') !== order.orderId) {
      return res.status(400).json({ error: 'Payment reference mismatch' });
    }

    const success = verification.status === 'success';
    if (success && !paymentMatches(verification, order.amount, order.currency, order.orderId)) {
      // Do not turn an order into FAILED on a mismatch; leave it pending for
      // reconciliation rather than risking a false-negative after a real charge.
      return res.status(400).json({ error: 'Payment amount or currency mismatch' });
    }

    if (!success) {
      return res.status(409).json({ error: 'Paystack has not confirmed a successful payment yet' });
    } else {
      await Order.updateOne(
        { _id: order._id, paymentStatus: 'PENDING', orderStatus: 'AWAITING_PAYMENT' },
        { $set: {
          paymentStatus: 'PAID',
          orderStatus: 'PAID',
          paidAt: new Date(),
          providerPaymentId: verification.id ? String(verification.id) : reference,
          failureReason: null,
        } }
      );
    }

    const settled = await Order.findById(order._id).lean();
    if (settled.paymentStatus !== 'PAID') {
      return res.status(409).json({ error: settled.failureReason || 'Payment is not confirmed' });
    }
    return res.json({ ok: true, order: settled });
  } catch (err) {
    console.error('Paystack verify error:', err.message || err);
    return res.status(502).json({ error: 'Paystack verification failed' });
  }
});

// Paystack webhook: this route is mounted before the global JSON parser so
// express.raw receives the exact bytes used for signature verification.
router.post('/paystack/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const secret = process.env.PAYSTACK_SECRET_KEY || '';
    const signature = req.headers['x-paystack-signature'];
    const rawBody = req.body;
    if (typeof signature !== 'string' || !secret || !Buffer.isBuffer(rawBody)) {
      return res.status(400).end();
    }

    if (!isValidPaystackSignature(rawBody, signature, secret)) {
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

    const success = event === 'charge.success' && data.status === 'success';
    if (!success) return res.json({ received: true });
    if (success && !paymentMatches(data, order.amount, order.currency, order.orderId)) {
      console.error('Paystack webhook amount/currency mismatch for order', reference);
      return res.status(400).json({ error: 'Payment amount or currency mismatch' });
    }

    // Conditional transition makes duplicate/out-of-order webhooks idempotent:
    // a late failed event cannot downgrade an already-paid order.
    const update = { paymentStatus: 'PAID', orderStatus: 'PAID', paidAt: new Date(), providerPaymentId: data.id ? String(data.id) : reference, failureReason: null };
    await Order.updateOne(
      { _id: order._id, paymentStatus: 'PENDING', orderStatus: 'AWAITING_PAYMENT' },
      { $set: update }
    );

    return res.json({ received: true });
  } catch (err) {
    console.error('Paystack webhook handling error', err);
    res.status(500).end();
  }
});

// Hubtel is not integrated yet. Do not expose a simulated checkout or an
// unsigned callback that could mark an order as paid.
router.all('/hubtel/*', (_req, res) => res.status(410).json({ error: 'Hubtel payments are not available yet' }));

module.exports = router;
