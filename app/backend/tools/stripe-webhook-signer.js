// Phase H″ — Generate Stripe-Signature header for test payloads
// Usage: node tools/stripe-webhook-signer.js <secret> <timestamp> <payload.json>
const fs = require('fs'); const crypto = require('crypto');
const [,, secret, tsArg, file] = process.argv;
const ts = tsArg || Math.floor(Date.now()/1000).toString();
const payload = fs.readFileSync(file || 0, 'utf8');
const sig = crypto.createHmac('sha256', secret).update(`${ts}.${payload}`).digest('hex');
console.log(`t=${ts},v1=${sig}`);
