import React from 'react';
import Head from 'next/head';
import '../styles/booking.module.css';
import { useRouter } from 'next/router';
import { Card } from '../../../packages/ui/components/Card';
import { useMeal } from '../../../packages/data/nutrition/hooks';

export default function MealDetail(){
  const router = useRouter(); const id = String(router.query.id||'m1');
  const { data, loading } = useMeal(id);
  if(loading) return <div dir="rtl">...</div>;
  if(!data) return <div dir="rtl">یافت نشد</div>;
  return (
    <div dir="rtl">
      <Head><title>{data.title} — آرمان ورزش</title></Head>
      <link rel="stylesheet" href="/packages/ui/tokens/tokens.css" />
      <Card>
        <h1>{data.title}</h1>
        <div>مجموع: {Math.round(data.totalKcal)} kcal</div>
        <ul>{data.items.map(it=> <li key={it.foodId}>{it.foodId} — {it.amount}</li>)}</ul>
      </Card>
    </div>
  );
}
