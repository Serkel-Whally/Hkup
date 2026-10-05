const { Schema, model } = require('mongoose');

const orderSchema = new Schema({
  orderId: { type: String, required: true, unique: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: false },
  planId: { type: String, default: null },
  bundleId: { type: String, default: null },
  network: { type: String, default: null },
  bundleSize: { type: String, default: null },
  validity: { type: String, default: null },
  recipientPhone: { type: String, default: null },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'GHS' },
  paymentStatus: {
    type: String,
    enum: ['UNPAID', 'PENDING', 'PAID', 'FAILED', 'REFUNDED'],
    default: 'UNPAID',
  },
  orderStatus: {
    type: String,
    enum: ['NEW', 'AWAITING_PAYMENT', 'PAID', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED', 'REFUNDED'],
    default: 'NEW',
  },
  paymentMethod: { type: String, default: 'Wallet' },
  paymentProvider: { type: String, default: null },
  providerPaymentId: { type: String, default: null },
  providerReference: { type: String, default: null },
  failureReason: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  paidAt: { type: Date, default: null },
  completedAt: { type: Date, default: null },
  refundedAt: { type: Date, default: null },
});

module.exports = model('Order', orderSchema);
