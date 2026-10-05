const express = require('express');
const Bundle = require('../models/Bundle');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { network } = req.query;
    const filter = { active: true };

    if (network) {
      filter.network = network;
    }

    const bundles = await Bundle.find(filter).sort({ price: 1 }).lean();
    res.json(bundles);
  } catch (err) {
    console.error('List bundles error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { network, size, validity, price, providerCost = 0, isPopular = false } = req.body || {};

    if (!network || !size || !validity || price === undefined || price === null) {
      return res.status(400).json({ error: 'network, size, validity and price are required' });
    }

    const bundleId = `${String(network).toLowerCase().replace(/\s+/g, '-')}-${String(size).toLowerCase().replace(/\s+/g, '-')}`;

    const existing = await Bundle.findOne({ bundleId });
    if (existing) {
      return res.status(409).json({ error: 'Bundle already exists' });
    }

    const bundle = new Bundle({
      bundleId,
      network,
      size,
      validity,
      price: Number(price),
      providerCost: Number(providerCost),
      isPopular: Boolean(isPopular),
      active: true,
    });

    await bundle.save();
    res.status(201).json(bundle);
  } catch (err) {
    console.error('Create bundle error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
