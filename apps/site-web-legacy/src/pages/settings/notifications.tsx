import React from 'react';
import Head from 'next/head';
import '../styles/booking.module.css';
import { Card } from '../../../packages/ui/components/Card';
import { useNotifPrefs } from '../../../packages/data/notifications/hooks';
export default function SettingsNotifications(){
  const { data: prefs, save } = useNotifPrefs();
  return (
    <div dir="rtl">
      <Head><title>تنظیمات اعلان‌ها — آرمان ورزش</title></Head>
      <Card>
        <h1>تنظیمات اعلان‌ها</h1>
        <div><label><input type="checkbox" checked={!!prefs?.push} onChange={e=> save({ push:e.target.checked })} /> Push</label></div>
        <div><label><input type="checkbox" checked={!!prefs?.email} onChange={e=> save({ email:e.target.checked })} /> Email</label></div>
        <div><label><input type="checkbox" checked={!!prefs?.sms} onChange={e=> save({ sms:e.target.checked })} /> SMS</label></div>
      </Card>
    </div>
  );
}
