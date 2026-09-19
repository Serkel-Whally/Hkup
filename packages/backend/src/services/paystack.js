const axios = require('axios');

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || '';
const PAYSTACK_INIT_URL = 'https://api.paystack.co/transaction/initialize';

async function initializeTransaction({ email, amount, reference, callback_url }) {
  if (!PAYSTACK_SECRET_KEY) throw new Error('Paystack secret key not set');
  const payload = {
    email,
    amount: Math.round(amount * 100), // convert to minor unit (e.g., pesewas)
    reference,
    callback_url
  };

  const res = await axios.post(PAYSTACK_INIT_URL, payload, {
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json'
    }
  });

  if (res.data && res.data.status) {
    return res.data.data; // contains authorization_url, access_code, reference
  }
  throw new Error('Paystack initialize failed');
}

module.exports = { initializeTransaction };
