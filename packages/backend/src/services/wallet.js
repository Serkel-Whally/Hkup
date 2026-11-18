const WalletTransaction = require('../models/WalletTransaction');

async function settleWalletFunding(reference, payment) {
  const funding = await WalletTransaction.findOne({ reference });
  if (!funding || funding.status !== 'PENDING') {
    return funding;
  }

  const succeeded = payment.status === 'success';
  const amountMatches = Number(payment.amount) === Math.round(funding.amount * 100);
  const currencyMatches = String(payment.currency || '').toUpperCase() === funding.currency;
  const isComplete = succeeded && amountMatches && currencyMatches;

  const update = isComplete
    ? {
        status: 'COMPLETED',
        providerPaymentId: payment.id ? String(payment.id) : reference,
        completedAt: new Date(),
        failureReason: null,
      }
    : {
        status: 'FAILED',
        failureReason: succeeded
          ? 'Payment amount or currency mismatch'
          : 'Payment was not successful',
      };

  const settled = await WalletTransaction.findOneAndUpdate(
    { reference, status: 'PENDING' },
    { $set: update },
    { new: true }
  );

  return settled || WalletTransaction.findOne({ reference });
}

module.exports = { settleWalletFunding };
