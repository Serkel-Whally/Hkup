const { Schema, model } = require('mongoose');

const bundleSchema = new Schema({
  bundleId: { type: String, required: true, unique: true },
  network: {
    type: String,
    required: true,
    enum: ['MTN', 'Telecel', 'AirtelTigo'],
  },
  size: { type: String, required: true },
  validity: { type: String, required: true },
  price: { type: Number, required: true },
  providerCost: { type: Number, default: 0 },
  isPopular: { type: Boolean, default: false },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = model('Bundle', bundleSchema);
