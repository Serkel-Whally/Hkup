const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const { paymentMatches, isValidPaystackSignature, normalizeGhanaPhone } = require('../src/services/payment-safety');

test('paymentMatches accepts only successful exact reference, amount and currency', () => {
  const payment = { status: 'success', reference: 'HKUP-123', amount: 2500, currency: 'GHS' };
  assert.equal(paymentMatches(payment, 25, 'GHS', 'HKUP-123'), true);
  assert.equal(paymentMatches({ ...payment, reference: 'OTHER' }, 25, 'GHS', 'HKUP-123'), false);
  assert.equal(paymentMatches({ ...payment, amount: 2499 }, 25, 'GHS', 'HKUP-123'), false);
  assert.equal(paymentMatches({ ...payment, currency: 'USD' }, 25, 'GHS', 'HKUP-123'), false);
  assert.equal(paymentMatches({ ...payment, status: 'failed' }, 25, 'GHS', 'HKUP-123'), false);
});

test('Paystack signature validation checks the raw payload with HMAC SHA-512', () => {
  const secret = 'test-secret';
  const body = Buffer.from(JSON.stringify({ event: 'charge.success' }));
  const signature = crypto.createHmac('sha512', secret).update(body).digest('hex');
  assert.equal(isValidPaystackSignature(body, signature, secret), true);
  assert.equal(isValidPaystackSignature(Buffer.from('tampered'), signature, secret), false);
  assert.equal(isValidPaystackSignature(body, 'not-a-signature', secret), false);
  assert.equal(isValidPaystackSignature(body, signature, ''), false);
});

test('Ghana phone normalization returns a local number or null', () => {
  assert.equal(normalizeGhanaPhone('024 123 4567'), '0241234567');
  assert.equal(normalizeGhanaPhone('+233 24 123 4567'), '0241234567');
  assert.equal(normalizeGhanaPhone('233241234567'), '0241234567');
  assert.equal(normalizeGhanaPhone('123'), null);
  assert.equal(normalizeGhanaPhone('02412345678'), null);
});
