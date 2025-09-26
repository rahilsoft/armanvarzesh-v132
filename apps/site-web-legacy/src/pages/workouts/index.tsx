import React from 'react';
import Head from 'next/head';
import '../../styles/booking.module.css';
import Link from 'next/link';
import { Card } from '../../../../packages/ui/components/Card';
import { useWorkouts } from '../../../../packages/data/workouts/hooks';

export default function WorkoutsIndex(){
  const { data, loading } = useWorkouts();
  return (
    <div dir="rtl">
      <Head><title>تمرین‌ها — آرمان ورزش</title></Head>
      <link rel="stylesheet" href="/packages/ui/tokens/tokens.css" />
      <h1>تمرین‌ها</h1>
      {loading? '...' : (data||[]).map(w=> <Card key={w.id}><b>{w.title}</b> — ~{w.estDurationMin} دقیقه — <Link href={`/workouts/${w.id}`}>شروع</Link></Card>)}
    </div>
  );
}
