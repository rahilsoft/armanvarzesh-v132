import React from 'react';
import Head from 'next/head';
import '../../styles/booking.module.css';
import Link from 'next/link';
import { Card } from '../../../packages/ui/components/Card';
import { useCoaches } from '../../../packages/data/coaches/hooks';

export default function CoachesPage(){
  const { data, loading, error } = useCoaches();
  return (
    <div dir="rtl">
      <Head><title>مربیان — آرمان ورزش</title></Head>
      <link rel="stylesheet" href="/packages/ui/tokens/tokens.css" />
      <h1>مربیان</h1>
      {loading? <p>...</p> : error? <p>خطا</p> :
        <div style={{display:'grid', gap:12, gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))'}}>
          {data?.map(c=> <Card key={c.id}><b>{c.name}</b> — {c.years} سال — ⭐ {c.rating}
            <div style={{marginTop:8}}><Link href={`/coach/${c.id}`}>پروفایل</Link></div>
          </Card>)}
        </div>
      }
    </div>
  );
}
