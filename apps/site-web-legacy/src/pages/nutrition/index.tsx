import React from 'react';
import Head from 'next/head';
import '../styles/booking.module.css';
import Link from 'next/link';
import { Card } from '../../../packages/ui/components/Card';
import { useMeals } from '../../../packages/data/nutrition/hooks';

export default function Nutrition(){
  const { data, loading } = useMeals();
  return (
    <div dir="rtl">
      <Head><title>تغذیه — آرمان ورزش</title></Head>
      <link rel="stylesheet" href="/packages/ui/tokens/tokens.css" />
      <h1>وعده‌ها</h1>
      {loading? '...' : (data||[]).map(m=> <Card key={m.id}><b>{m.title}</b> — {Math.round(m.totalKcal)} kcal — <Link href={`/meals/${m.id}`}>نمایش</Link></Card>)}
    </div>
  );
}
