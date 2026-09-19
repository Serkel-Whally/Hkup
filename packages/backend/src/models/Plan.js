const { Schema, model } = require('mongoose');

const planSchema = new Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  currency: { type: String, default: 'GHS' },
  validityDays: { type: Number, default: 30 },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = model('Plan', planSchema);
