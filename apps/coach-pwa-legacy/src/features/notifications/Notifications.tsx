import React from 'react';
import { useNotifications } from '../../../packages/data/notifications/hooks';
export default function Notifications(){
  const { data, loading } = useNotifications();
  return (
    <div dir="rtl" style={{padding:12}}>
      <h3>اعلان‌ها (PWA)</h3>
      {loading? '...' : (data||[]).map(n=> <div key={n.id}>{n.title}</div>)}
    </div>
  );
}
