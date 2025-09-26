import React from 'react';
import Head from 'next/head';
import './styles/booking.module.css';
import { Card } from '../../packages/ui/components/Card';
import { Button } from '../../packages/ui/components/Button';
import { useThreads } from '../../packages/data/inbox/hooks';
import { useNotifFeed, useNotifPrefs } from '../../packages/data/notifications/hooks';

export default function NotificationsPage(){
  const { data: threads, loading: thLoading } = useThreads();
  const { data: feed, loading: fdLoading, read } = useNotifFeed();
  const { data: prefs, save } = useNotifPrefs();
  async function requestPush(){
    // very simple mock for permission + registration
    const token = Math.random().toString(36).slice(2);
    const reg = await (await import('../../packages/data/notifications/hooks')).registerDevice({ token, platform:'web' } as any);
    alert('Registered (mock): '+JSON.stringify(reg));
  }
  return (
    <div dir="rtl">
      <Head><title>اطلاع‌رسانی‌ها — آرمان ورزش</title></Head>
      <link rel="stylesheet" href="/packages/ui/tokens/tokens.css" />
      <h1>اطلاع‌رسانی‌ها</h1>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
        <Card>
          <h3>Inbox</h3>
          {thLoading? '...' : <ul>{(threads||[]).map(t=> <li key={t.id}>{t.subject} — {t.unread} جدید</li>)}</ul>}
        </Card>
        <Card>
          <h3>Feed</h3>
          {fdLoading? '...' : (feed||[]).map(n=> <div key={n.id} style={{marginBottom:6}}>
            <b>{n.title}</b> — {n.body} — {n.read? 'خوانده‌شده' : <button onClick={()=> read(n.id)}>علامت خوانده‌شده</button>}
          </div>)}
        </Card>
      </div>
      <Card>
        <h3>تنظیمات</h3>
        <div style={{display:'flex', gap:12, alignItems:'center'}}>
          <label><input type="checkbox" checked={!!prefs?.push} onChange={e=> save({ push: e.target.checked })} /> Push</label>
          <label><input type="checkbox" checked={!!prefs?.email} onChange={e=> save({ email: e.target.checked })} /> Email</label>
          <label><input type="checkbox" checked={!!prefs?.sms} onChange={e=> save({ sms: e.target.checked })} /> SMS</label>
          <Button onClick={requestPush}>فعال‌سازی پوش (موک)</Button>
        </div>
      </Card>
    </div>
  );
}
