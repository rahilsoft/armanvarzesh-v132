import React from 'react';
import Head from 'next/head';
import '../../styles/booking.module.css';
import Link from 'next/link';
import { Card } from '../../../packages/ui/components/Card';
import { useWorkoutPlan } from '../../../packages/data/workouts/hooks';

export default function WorkoutsPage(){
  const { data, loading, error } = useWorkoutPlan();
  return (
    <div dir="rtl">
      <Head><title>تمرین‌ها — آرمان ورزش</title></Head>
      <link rel="stylesheet" href="/packages/ui/tokens/tokens.css" />
      <h1>برنامه تمرین</h1>
      {loading? <p>...</p> : error? <p>خطا</p> : !data? <p>برنامه‌ای نیست</p> :
        <div style={{display:'grid', gap:12}}>
          {data.sessions.map(s=> <Card key={s.id}><b>{new Date(s.date).toLocaleDateString('fa-IR')}</b> — {s.status} — <Link href={`/workout/${s.id}`}>جزئیات</Link></Card>)}
        </div>
      }
    </div>
  );
}
