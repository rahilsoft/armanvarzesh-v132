import React from 'react';
import Head from 'next/head';
import '../../../styles/booking.module.css';
import { useRouter } from 'next/router';
import { Card } from '../../../../packages/ui/components/Card';
import { Button } from '../../../../packages/ui/components/Button';
import { useCourse, useEnroll } from '../../../../packages/data/courses/hooks';

export default function CourseDetail(){
  const router = useRouter();
  const id = String(router.query.id||'c-1');
  const { data, loading, error, reload } = useCourse(id);
  const { mutate: enroll, loading: enrolling } = useEnroll();
  return (
    <div dir="rtl">
      <Head><title>دوره — آرمان ورزش</title></Head>
      <link rel="stylesheet" href="/packages/ui/tokens/tokens.css" />
      <h1>دوره</h1>
      {loading? <p>...</p> : error? <p>خطا</p> : data? (
        <Card>
          <h2>{data.title}</h2>
          <div>مدرس: {data.coach} — سطح: {data.level}</div>
          <div style={{marginTop:8}}>
            <ol>{data.lessons.map(l=> <li key={l.id}>{l.title} — {l.durMin} دقیقه</li>)}</ol>
          </div>
          <Button busy={enrolling} onClick={()=> enroll(id)}>ثبت‌نام</Button>
        </Card>
      ) : <p>یافت نشد</p>}
    </div>
  );
}
