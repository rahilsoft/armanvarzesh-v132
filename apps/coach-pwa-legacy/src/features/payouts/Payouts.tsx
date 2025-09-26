import React, { useEffect, useState } from 'react';
import { requestPayout, myPayouts } from './api';

export default function Payouts(){
  const [amount, setAmount] = useState('5000');
  const [items, setItems] = useState<any[]>([]);

  const refresh = async ()=>{
    const r = await myPayouts();
    setItems(r.items||[]);
  };
  useEffect(()=>{ refresh(); },[]);

  const onReq = async ()=>{
    await requestPayout(Number(amount));
    refresh();
  };

  return <div style={{ padding:16 }}>
    <h2>Payouts</h2>
    <input value={amount} onChange={e=> setAmount(e.target.value)} placeholder="amount (cents)" />
    <button onClick={onReq}>Request</button>

    <table style={{ marginTop:12 }}>
      <thead><tr><th>ID</th><th>Amount</th><th>Status</th><th>Created</th></tr></thead>
      <tbody>
        {items.map((x:any)=>(<tr key={x.id}><td>{x.id}</td><td>{x.amountCents}</td><td>{x.status}</td><td>{x.createdAt}</td></tr>))}
      </tbody>
    </table>
  </div>;
}
