import React from 'react';
import { useCoaches } from '../../../../packages/data/coaches/hooks';
export default function Directory(){
  const { data, loading } = useCoaches({});
  if(loading) return <div>Loading…</div>;
  return (
    <div dir="rtl">
      <h2>فهرست مربی‌ها</h2>
      <table><thead><tr><th>نام</th><th>تخصص</th><th>امتیاز</th></tr></thead>
      <tbody>{(data||[]).map(c=> <tr key={c.id}><td>{c.name}</td><td>{c.tags.join(', ')}</td><td>{c.rating}</td></tr>)}</tbody>
      </table>
    </div>
  );
}
