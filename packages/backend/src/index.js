const express = require('express');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');

const { connect } = require('./db');
const authRoutes = require('./routes/auth');
const plansRoutes = require('./routes/plans');
const miscRoutes = require('./routes/misc');

const PORT = process.env.PORT || 5000;

async function start() {
  await connect();
  console.log('Connected to MongoDB');

  const app = express();
  app.use(cors({ origin: true, credentials: true }));
  app.use(cookieParser());
  app.use(bodyParser.json());

  app.use('/api/auth', authRoutes);
  app.use('/api/plans', plansRoutes);
  app.use('/api', miscRoutes);

  app.listen(PORT, () => {
    console.log(`Whally backend listening on http://localhost:${PORT}`);
  });
}

start().catch(err => {
  console.error('Failed to start:', err);
  process.exit(1);
});
