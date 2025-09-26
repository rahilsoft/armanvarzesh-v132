import React, { useState } from 'react';
import Head from 'next/head';
import '../../styles/booking.module.css';
import { useRouter } from 'next/router';
import { Card } from '../../../../packages/ui/components/Card';
import { Button } from '../../../../packages/ui/components/Button';
import { useCoach } from '../../../../packages/data/coaches/hooks';
import { useReviews, useAddReview } from '../../../../packages/data/reviews/hooks';

export default function CoachProfile(){
  const router = useRouter(); const id = String(router.query.id||'c1');
  const { data, loading } = useCoach(id);
  const { data: reviews, reload } = useReviews(id);
  const { mutate: add, loading: adding } = useAddReview();
  const [stars,setStars] = useState(5); const [comment,setComment] = useState('');
  return (
    <div dir="rtl">
      <Head><title>پروفایل مربی — آرمان ورزش</title></Head>
      <link rel="stylesheet" href="/packages/ui/tokens/tokens.css" />
      {loading? '...' : !data? 'یافت نشد' :
        <>
          <Card>
            <h1>{data.name}</h1>
            <div>⭐ {data.rating} — {data.experience} سال سابقه — {data.tags.join('، ')}</div>
            <p>{data.bio}</p>
            <Button>رزرو</Button>
          </Card>
          <Card>
            <h3>نظرات</h3>
            {(reviews||[]).map(r=> <div key={r.id}>⭐ {r.stars} — {r.comment||''}</div>)}
            <div style={{marginTop:8, display:'flex', gap:6}}>
              <input type="number" min={1} max={5} value={stars} onChange={e=> setStars(Number(e.target.value))} />
              <input value={comment} onChange={e=> setComment(e.target.value)} placeholder="نظر…" />
              <Button busy={adding} onClick={async()=>{ await add(id, stars, comment); setComment(''); await reload(); }}>ثبت نظر</Button>
            </div>
          </Card>
        </>
      }
    </div>
  );
}
