const express = require('express');
const path = require('path');
const fs = require('fs');

const router = express.Router();

router.get('/health', (req, res) => res.json({ ok: true }));

router.get('/api-info', (req, res) => {
  res.json({
    name: 'Whally API',
    status: 'online',
    version: '1.0.0',
    features: ['auth', 'bundles', 'orders', 'wallet'],
  });
});

module.exports = router;
