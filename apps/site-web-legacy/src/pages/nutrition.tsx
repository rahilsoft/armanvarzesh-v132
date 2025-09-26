import React, { useState } from 'react';
import Head from 'next/head';
import '../../styles/booking.module.css';
import { Button } from '../../../packages/ui/components/Button';
import { Card } from '../../../packages/ui/components/Card';
import { usePlan, useLogMeal } from '../../../packages/data/nutrition/hooks';

export default function NutritionPage(){
  const { data, loading, error, reload } = usePlan();
  const { mutate: log, loading: logging } = useLogMeal();
  const [name,setName] = useState('Chicken breast');
  const [calories,setCalories] = useState(300);
  const [protein,setProtein] = useState(40);

  return (
    <div dir="rtl">
      <Head><title>تغذیه — آرمان ورزش</title></Head>
      <link rel="stylesheet" href="/packages/ui/tokens/tokens.css" />
      <h1>برنامه غذایی</h1>
      {loading && <p>در حال بارگذاری…</p>}
      {error && <p>خطا</p>}
      {data && (
        <Card>
          <div>هدف پروتئین روزانه: {data.dailyProteinTarget} گرم — هدف کالری: {data.dailyCalorieTarget}</div>
          <div style={{marginTop:12}}>
            <input value={name} onChange={e=>setName(e.target.value)} />
            <input type="number" value={calories} onChange={e=>setCalories(Number(e.target.value||0))} />
            <input type="number" value={protein} onChange={e=>setProtein(Number(e.target.value||0))} />
            <Button onClick={async()=>{ await log(name, calories, protein, new Date().toISOString()); reload(); }} busy={logging}>ثبت وعده</Button>
          </div>
          <div style={{marginTop:16}}>
            {data.meals.map(m=> <div key={m.id}>{m.name} — {m.calories} kcal — {m.protein} g</div>)}
          </div>
        </Card>
      )}
    </div>
  );
}
