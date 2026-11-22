const WalletTransaction = require('../models/WalletTransaction');

async function settleWalletFunding(reference, payment) {
  const funding = await WalletTransaction.findOne({ reference });
  if (!funding || funding.status !== 'PENDING') return funding;

  // Failed/incomplete attempts and mismatched amounts stay pending for a
  // fresh server-side verification or reconciliation. Never credit them.
  if (payment.status !== 'success' || String(payment.reference || '') !== reference) {
    return funding;
  }

  const amountMatches = Number(payment.amount) === Math.round(funding.amount * 100);
  const currencyMatches = String(payment.currency || '').toUpperCase() === funding.currency;
  if (!amountMatches || !currencyMatches) {
    console.error('Paystack wallet funding amount/currency mismatch:', reference);
    return funding;
  }

  const settled = await WalletTransaction.findOneAndUpdate(
    { reference, status: 'PENDING' },
    {
      $set: {
        status: 'COMPLETED',
        providerPaymentId: payment.id ? String(payment.id) : reference,
        completedAt: new Date(),
        failureReason: null,
      },
    },
    { new: true }
  );

  return settled || WalletTransaction.findOne({ reference });
}

module.exports = { settleWalletFunding };
