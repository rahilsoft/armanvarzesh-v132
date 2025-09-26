import React from 'react';
import { useSettlements } from '../../../../packages/data/payments/hooks';
export default function Settlements(){
  const { data, loading, error } = useSettlements();
  if(loading) return <div>Loading…</div>;
  if(error) return <div>Error</div>;
  return (
    <div dir="rtl">
      <h2>تسویه‌های درگاه</h2>
      <table><thead><tr><th>شناسه</th><th>تاریخ</th><th>تعداد</th><th>جمع</th><th>وضعیت</th></tr></thead>
        <tbody>{(data||[]).map(s=> <tr key={s.id}><td>{s.id}</td><td>{new Date(s.at).toLocaleString('fa-IR')}</td><td>{s.count}</td><td>{s.total} {s.currency}</td><td>{s.status}</td></tr>)}</tbody>
      </table>
    </div>
  );
}
