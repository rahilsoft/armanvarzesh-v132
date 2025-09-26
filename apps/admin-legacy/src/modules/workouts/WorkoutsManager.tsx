import React from 'react';
import { useWorkoutPlan } from '../../../../packages/data/workouts/hooks';
export default function WorkoutsManager(){
  const { data, loading, error } = useWorkoutPlan();
  if(loading) return <div>Loading…</div>;
  if(error) return <div>Error</div>;
  if(!data) return <div>Empty</div>;
  return (
    <div dir="rtl">
      <h2>مدیریت تمرین‌ها</h2>
      <table><thead><tr><th>جلسه</th><th>تاریخ</th><th>وضعیت</th></tr></thead>
        <tbody>{data.sessions.map(s=> <tr key={s.id}><td>{s.id}</td><td>{new Date(s.date).toLocaleString('fa-IR')}</td><td>{s.status}</td></tr>)}</tbody>
      </table>
    </div>
  );
}
