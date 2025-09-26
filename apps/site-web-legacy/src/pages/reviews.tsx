import React from 'react';
import Head from 'next/head';
import '../../styles/booking.module.css';
import { Card } from '../../../packages/ui/components/Card';
import { useReviews } from '../../../packages/data/reviews/hooks';

export default function ReviewsPage(){
  // Demo: show reviews for a default coach id
  const { data, loading, error } = useReviews('coach','k1');
  return (
    <div dir="rtl">
      <Head><title>دیدگاه‌ها — آرمان ورزش</title></Head>
      <link rel="stylesheet" href="/packages/ui/tokens/tokens.css" />
      <h1>دیدگاه‌ها</h1>
      <Card>
        {loading? '...' : error? 'خطا' : (data||[]).map(r=> <div key={r.id}>{r.user}: {r.rating}/5 — {r.comment||'—'}</div>)}
      </Card>
    </div>
  );
}
