import React from 'react';
import { useNotifFeed, useNotifPrefs } from '../../../packages/data/notifications/hooks';
export default function Notifications(){
  const { data: feed, read } = useNotifFeed();
  const { data: prefs, save } = useNotifPrefs();
  return (
    <div dir="rtl" style={{padding:12}}>
      <h3>اعلان‌ها (PWA)</h3>
      <label><input type="checkbox" checked={!!prefs?.push} onChange={e=> save({ push:e.target.checked })} /> Push</label>
      {(feed||[]).map(n=> <div key={n.id}><b>{n.title}</b> — {n.body} {!n.read && <button onClick={()=> read(n.id)}>خوانده‌شده</button>}</div>)}
    </div>
  );
}
