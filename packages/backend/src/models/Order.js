const { Schema, model } = require('mongoose');

const orderSchema = new Schema({
  orderId: { type: String, required: true, unique: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: false },
  planId: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'GHS' },
  status: { type: String, enum: ['pending','paid','failed','delivered'], default: 'pending' },
  paymentProvider: { type: String },
  providerPaymentId: { type: String },
  createdAt: { type: Date, default: Date.now },
  paidAt: { type: Date }
});

module.exports = model('Order', orderSchema);
