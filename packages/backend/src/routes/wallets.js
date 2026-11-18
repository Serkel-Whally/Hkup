const express = require('express');
const { v4: uuid } = require('uuid');
const WalletTransaction = require('../models/WalletTransaction');
const { requireAuth } = require('../middleware/auth');
const { initializeTransaction, verifyTransaction } = require('../services/paystack');
const { settleWalletFunding } = require('../services/wallet');

const router = express.Router();

router.use(requireAuth);

router.get('/', async (req, res) => {
  try {
    const userId = req.user._id;
    const [balanceResult, transactions] = await Promise.all([
      WalletTransaction.aggregate([
        { $match: { userId, status: 'COMPLETED' } },
        { $group: { _id: null, balance: { $sum: '$amount' } } },
      ]),
      WalletTransaction.find({ userId }).sort({ createdAt: -1 }).limit(25).lean(),
    ]);

    res.json({
      balance: Number((balanceResult[0]?.balance || 0).toFixed(2)),
      transactions,
    });
  } catch (err) {
    console.error('Get wallet error:', err);
    res.status(500).json({ error: 'Unable to load wallet' });
  }
});

router.post('/fund/initialize', async (req, res) => {
  let funding;
  try {
    const amountInput = Number(req.body?.amount);
    const amount = Math.round(amountInput * 100) / 100;
    if (!Number.isFinite(amountInput) || amount <= 0 || amount !== amountInput) {
      return res.status(400).json({ error: 'Enter an amount greater than zero with up to two decimal places' });
    }

    funding = await WalletTransaction.create({
      reference: `CLD-WALLET-${Date.now()}-${uuid().slice(0, 8).toUpperCase()}`,
      userId: req.user._id,
      amount,
      currency: 'GHS',
      status: 'PENDING',
      paymentProvider: 'Paystack',
    });

    const data = await initializeTransaction({
      email: req.user.email,
      amount,
      reference: funding.reference,
      callback_url: new URL('/wallet', process.env.FRONTEND_URL || 'http://localhost:3000').toString(),
    });

    res.status(201).json({
      reference: funding.reference,
      authorizationUrl: data.authorization_url,
    });
  } catch (err) {
    if (funding) {
      try {
        funding.status = 'FAILED';
        funding.failureReason = 'Unable to initialize payment';
        await funding.save();
      } catch (saveError) {
        console.error('Unable to record failed wallet initialization:', saveError);
      }
    }
    console.error('Wallet funding initialization error:', err.message || err);
    res.status(502).json({ error: 'Unable to initialize wallet funding' });
  }
});

router.post('/fund/verify', async (req, res) => {
  try {
    const { reference } = req.body || {};
    if (!reference) return res.status(400).json({ error: 'reference required' });

    const funding = await WalletTransaction.findOne({
      reference,
      userId: req.user._id,
    });
    if (!funding) return res.status(404).json({ error: 'Wallet funding not found' });

    if (funding.status === 'PENDING') {
      const verification = await verifyTransaction(reference);
      if (!verification) {
        return res.status(502).json({ error: 'Paystack verification failed' });
      }
      await settleWalletFunding(reference, verification);
    }

    const settled = await WalletTransaction.findOne({
      reference,
      userId: req.user._id,
    }).lean();
    if (settled.status !== 'COMPLETED') {
      return res.status(400).json({ error: settled.failureReason || 'Wallet funding is not complete', transaction: settled });
    }

    return res.json({ ok: true, transaction: settled });
  } catch (err) {
    console.error('Wallet funding verification error:', err.message || err);
    return res.status(500).json({ error: 'Unable to verify wallet funding' });
  }
});

module.exports = router;
