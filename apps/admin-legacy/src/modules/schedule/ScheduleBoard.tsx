import React from 'react';
import { useSchedule } from '../../../../packages/data/schedule/hooks';
export default function ScheduleBoard(){
  const { data, loading } = useSchedule();
  if(loading) return <div>Loading…</div>;
  return (
    <div dir="rtl">
      <h2>Board زمان‌بندی</h2>
      <table><thead><tr><th>تاریخ</th><th>ورک‌اوت</th><th>وضعیت</th></tr></thead>
      <tbody>{(data||[]).map(s=> <tr key={s.id}><td>{new Date(s.date).toLocaleString('fa-IR')}</td><td>{s.workoutId}</td><td>{s.status}</td></tr>)}</tbody></table>
    </div>
  );
}
