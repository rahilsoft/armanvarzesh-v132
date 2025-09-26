import React from 'react';
import Head from 'next/head';
import '../styles/booking.module.css';
import { Card } from '../../../packages/ui/components/Card';
import { usePrograms } from '../../../packages/data/programs/hooks';
export default function Programs(){
  const { data, loading } = usePrograms();
  return (
    <div dir="rtl">
      <Head><title>برنامه‌ها — آرمان ورزش</title></Head>
      <link rel="stylesheet" href="/packages/ui/tokens/tokens.css" />
      <h1>برنامه‌ها</h1>
      {loading? '...' : (data||[]).map(p=> <Card key={p.id}><b>{p.title}</b> — {p.weeks} هفته</Card>)}
    </div>
  );
}
