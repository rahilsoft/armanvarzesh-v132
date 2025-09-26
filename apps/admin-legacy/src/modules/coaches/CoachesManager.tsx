import React from 'react';
import { useCoaches } from '../../../../packages/data/coaches/hooks';
export default function CoachesManager(){
  const { data, loading, error } = useCoaches();
  if(loading) return <div>Loading…</div>;
  if(error) return <div>Error</div>;
  return (
    <div dir="rtl">
      <h2>مدیریت مربیان</h2>
      <table><thead><tr><th>نام</th><th>سابقه</th><th>امتیاز</th></tr></thead>
        <tbody>{data?.map(c=> <tr key={c.id}><td>{c.name}</td><td>{c.years}</td><td>{c.rating}</td></tr>)}</tbody>
      </table>
    </div>
  );
}
