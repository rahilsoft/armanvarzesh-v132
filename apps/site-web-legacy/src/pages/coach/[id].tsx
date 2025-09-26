import React from 'react';
import Head from 'next/head';
import '../../../styles/booking.module.css';
import { useRouter } from 'next/router';
import { Card } from '../../../../packages/ui/components/Card';
import { useCoach } from '../../../../packages/data/coaches/hooks';
import { useReviews, useCreateReview } from '../../../../packages/data/reviews/hooks';
import { Button } from '../../../../packages/ui/components/Button';

export default function CoachProfile(){
  const router = useRouter();
  const id = String(router.query.id||'k1');
  const { data, loading, error } = useCoach(id);
  const { data: revs, reload } = useReviews('coach', id);
  const { mutate: create, loading: posting } = useCreateReview();
  return (
    <div dir="rtl">
      <Head><title>پروفایل مربی — آرمان ورزش</title></Head>
      <link rel="stylesheet" href="/packages/ui/tokens/tokens.css" />
      <h1>پروفایل مربی</h1>
      {loading? <p>...</p> : error? <p>خطا</p> : !data? <p>یافت نشد</p> :
        <Card>
          <h2>{data.name} — ⭐ {data.rating}</h2>
          <div>سابقه: {data.years} سال</div>
          <div>تخصص‌ها: {data.specialties.join(', ')}</div>
          <p>{data.bio||''}</p>
        </Card>
      }
      <h3>دیدگاه‌ها</h3>
      <Card>
        {(revs||[]).map(r=> <div key={r.id}><b>{r.user}</b> — {r.rating}/5 — {r.comment||'—'}</div>)}
        <Button busy={posting} onClick={async()=>{ await create('coach', id, 5, 'عالی'); reload(); }} style={{marginTop:8}}>نظر ۵ ستاره‌ی نمونه</Button>
      </Card>
    </div>
  );
}
