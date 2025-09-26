import React from 'react';
import { usePayroll } from '../../../../packages/data/payroll/hooks';
export default function PayrollManager(){
  const { data, loading, error } = usePayroll();
  if(loading) return <div>Loading…</div>;
  if(error) return <div>Error</div>;
  return (
    <div dir="rtl">
      <h2>مدیریت حقوق</h2>
      <div>جمع کل: {data?.total} {data?.currency}</div>
      <table><thead><tr><th>دوره</th><th>مبلغ</th><th>وضعیت</th></tr></thead>
        <tbody>{data?.items.map(i=> <tr key={i.id}><td>{i.period}</td><td>{i.amount}</td><td>{i.status}</td></tr>)}</tbody>
      </table>
    </div>
  );
}
