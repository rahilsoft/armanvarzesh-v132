import { formatCurrency } from '@arman/utils';
import React, { useState } from 'react';
import { api } from '../../src/lib/api';

export default function Checkout() {
  const [amount, setAmount] = useState(10000);
  const [currency, setCurrency] = useState('IRR');
  const [result, setResult] = useState<any>(null);
  async function onPay() {
    try {
      const res = await api.post('/payments', { userId: 'demo-web', amountCents: amount, currency });
      setResult(res.data || res);
    } catch (e: any) {
      setResult({ error: e?.message || 'Failed' });
    }
  }
  return (
    <div style={{ padding: 24 }}>
      <h1>Checkout</h1>
      <div>
        <label>Amount (cents): </label>
        <input type="number" value={amount} onChange={(e) => setAmount(parseInt(e.target.value,10))} />
      </div>
      <div>
        <label>Currency: </label>
        <input value={currency} onChange={(e) => setCurrency(e.target.value.toUpperCase())} />
      </div>
      <div style={{ marginTop: 8 }}>{formatCurrency(amount, currency)}</div>
      <button onClick={onPay}>Pay</button>
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </div>
  );
}
