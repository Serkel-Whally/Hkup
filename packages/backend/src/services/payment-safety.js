const crypto = require('crypto');

function paymentMatches(payment, expectedAmount, expectedCurrency, expectedReference) {
  if (!payment || payment.status !== 'success') return false;
  return (
    String(payment.reference || '') === String(expectedReference) &&
    Number(payment.amount) === Math.round(Number(expectedAmount) * 100) &&
    String(payment.currency || '').toUpperCase() === String(expectedCurrency || '').toUpperCase()
  );
}

function isValidPaystackSignature(rawBody, signature, secret) {
  if (!Buffer.isBuffer(rawBody) || typeof signature !== 'string' || !secret || !/^[a-f0-9]{128}$/i.test(signature)) return false;
  const expected = crypto.createHmac('sha512', secret).update(rawBody).digest();
  const received = Buffer.from(signature, 'hex');
  return received.length === expected.length && crypto.timingSafeEqual(expected, received);
}

function normalizeGhanaPhone(value) {
  const normalized = String(value || '').replace(/[\s()-]/g, '').trim();
  if (/^0[2-9]\d{8}$/.test(normalized)) return normalized;
  if (/^(?:\+?233)[2-9]\d{8}$/.test(normalized)) return normalized.replace(/^\+?233/, '0');
  return null;
}

module.exports = { paymentMatches, isValidPaystackSignature, normalizeGhanaPhone };
