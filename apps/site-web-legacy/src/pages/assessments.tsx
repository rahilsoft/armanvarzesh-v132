import React from 'react';
import Head from 'next/head';
import '../../styles/booking.module.css';
import Link from 'next/link';
import { Card } from '../../../packages/ui/components/Card';
import { useAssessments } from '../../../packages/data/assessments/hooks';

export default function AssessmentsPage(){
  const { data, loading, error } = useAssessments();
  return (
    <div dir="rtl">
      <Head><title>ارزیابی‌ها — آرمان ورزش</title></Head>
      <link rel="stylesheet" href="/packages/ui/tokens/tokens.css" />
      <h1>ارزیابی‌ها</h1>
      {loading? <p>...</p> : error? <p>خطا</p> : !data || data.length===0? <p>یافت نشد</p> :
        data.map(a=> <Card key={a.id}><b>{a.title}</b> — <Link href={`/assessment/${a.id}`}>شروع</Link></Card>)
      }
    </div>
  );
}
