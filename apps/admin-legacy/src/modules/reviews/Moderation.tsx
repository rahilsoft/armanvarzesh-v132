import React from 'react';
import { useReviews, useModerate } from '../../../../packages/data/reviews/hooks';
export default function Moderation(){
  const { data, loading, error, reload } = useReviews('c1');
  const { mutate: mod, loading: moderating } = useModerate();
  if(loading) return <div>Loading…</div>;
  if(error) return <div>Error</div>;
  return (
    <div dir="rtl">
      <h2>مدیریت نظرات</h2>
      {(data||[]).map(r=> <div key={r.id} style={{display:'flex', gap:8, alignItems:'center'}}>
        <span>⭐ {r.stars} — {r.comment||''}</span>
        <button disabled={moderating} onClick={async()=>{ await mod(r.id, 'hidden'); await reload(); }}>مخفی</button>
      </div>)}
    </div>
  );
}
