import React from 'react';
import { useWallet } from '../../../../packages/data/payments/hooks';
export default function PaymentsTable(){
  const { data, loading, error } = useWallet();
  if(loading) return <div>Loading…</div>;
  if(error) return <div>Error</div>;
  if(!data) return <div>Empty</div>;
  return (
    <table dir="rtl">
      <thead><tr><th>نوع</th><th>مبلغ</th><th>تاریخ</th><th>یادداشت</th></tr></thead>
      <tbody>
        {data.history.map(h=> <tr key={h.id}><td>{h.type}</td><td>{h.amount}</td><td>{new Date(h.at).toLocaleString('fa-IR')}</td><td>{h.note||'—'}</td></tr>)}
      </tbody>
    </table>
  );
}
