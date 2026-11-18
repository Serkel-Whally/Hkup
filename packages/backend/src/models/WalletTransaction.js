const { Schema, model } = require('mongoose');

const walletTransactionSchema = new Schema({
  reference: { type: String, required: true, unique: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: { type: String, enum: ['FUNDING'], default: 'FUNDING' },
  amount: { type: Number, required: true, min: 0.01 },
  currency: { type: String, default: 'GHS' },
  status: {
    type: String,
    enum: ['PENDING', 'COMPLETED', 'FAILED'],
    default: 'PENDING',
  },
  paymentProvider: { type: String, default: 'Paystack' },
  providerPaymentId: { type: String, default: null },
  failureReason: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  completedAt: { type: Date, default: null },
});

walletTransactionSchema.index({ userId: 1, createdAt: -1 });

module.exports = model('WalletTransaction', walletTransactionSchema);
