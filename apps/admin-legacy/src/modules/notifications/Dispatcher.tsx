import React from 'react';
import { useNotifications } from '../../../../packages/data/notifications/hooks';
export default function Dispatcher(){
  const { data, loading, error } = useNotifications();
  if(loading) return <div>Loading…</div>;
  if(error) return <div>Error</div>;
  return (
    <div dir="rtl">
      <h2>اعلان‌ها — Dispatcher</h2>
      <ul>{(data||[]).map(n=> <li key={n.id}>{n.title} — {n.type}</li>)}</ul>
      <p>برای ارسال Broadcast، آداپتر API را به سرویس نوتیفیکیشن وصل کنید.</p>
    </div>
  );
}
