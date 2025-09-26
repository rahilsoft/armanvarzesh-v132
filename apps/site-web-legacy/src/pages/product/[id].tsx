import React from 'react';
import Head from 'next/head';
import '../../../styles/booking.module.css';
import { useRouter } from 'next/router';
import { Card } from '../../../../packages/ui/components/Card';
import { Button } from '../../../../packages/ui/components/Button';
import { useProduct, useAddToCart } from '../../../../packages/data/marketplace/hooks';
import { useReviews, useCreateReview } from '../../../../packages/data/reviews/hooks';

export default function ProductDetail(){
  const router = useRouter();
  const id = String(router.query.id||'p1');
  const { data, loading, error } = useProduct(id);
  const { mutate: add, loading: adding } = useAddToCart();
  const { data: revs, reload } = useReviews('product', id);
  const { mutate: create, loading: posting } = useCreateReview();

  return (
    <div dir="rtl">
      <Head><title>محصول — آرمان ورزش</title></Head>
      <link rel="stylesheet" href="/packages/ui/tokens/tokens.css" />
      <h1>محصول</h1>
      {loading? <p>...</p> : error? <p>خطا</p> : !data? <p>یافت نشد</p> :
        <Card>
          <h2>{data.title}</h2>
          <div>{data.price} IRT</div>
          <Button busy={adding} onClick={()=> add(id,1)}>افزودن به سبد</Button>
        </Card>
      }
      <h3>دیدگاه‌ها</h3>
      <Card>
        {(revs||[]).map(r=> <div key={r.id}><b>{r.user}</b> — {r.rating}/5 — {r.comment||'—'}</div>)}
        <div style={{marginTop:8}}>
          <Button busy={posting} onClick={async()=>{ await create('product', id, 5, 'عالی'); reload(); }}>نظر ۵ ستاره‌ی نمونه</Button>
        </div>
      </Card>
    </div>
  );
}
