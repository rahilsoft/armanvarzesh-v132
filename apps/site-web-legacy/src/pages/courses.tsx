import React from 'react';
import Head from 'next/head';
import '../../styles/booking.module.css';
import Link from 'next/link';
import { Card } from '../../../packages/ui/components/Card';
import { Button } from '../../../packages/ui/components/Button';
import { useCourses, useEnroll } from '../../../packages/data/courses/hooks';

export default function CoursesPage(){
  const { data, loading, error, reload } = useCourses();
  const { mutate: enroll, loading: enrolling } = useEnroll();
  return (
    <div dir="rtl">
      <Head><title>دوره‌ها — آرمان ورزش</title></Head>
      <link rel="stylesheet" href="/packages/ui/tokens/tokens.css" />
      <h1>دوره‌ها</h1>
      {loading && <p>...</p>}
      {error && <p>خطا</p>}
      <div style={{display:'grid', gap:12, gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))'}}>
        {data?.map(c=> (
          <Card key={c.id}>
            <b>{c.title}</b><div>{c.coach}</div><div>{c.level}</div>
            <div style={{marginTop:8, display:'flex', gap:8}}>
              <Link href={`/course/${c.id}`}>جزئیات</Link>
              <Button busy={enrolling} onClick={async()=> enroll(c.id)}>ثبت‌نام</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
