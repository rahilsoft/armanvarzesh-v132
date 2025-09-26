import React, { useState } from 'react';
import { useNotifications } from '../../../../packages/data/notifications/hooks';
export default function BroadcastCenter(){
  const { data, loading, error, reload } = useNotifications();
  const [title,setTitle] = useState('');
  const [body,setBody] = useState('');
  return (
    <div dir="rtl">
      <h2>مرکز ارسال اعلان</h2>
      <div style={{display:'grid',gap:8, maxWidth:520}}>
        <input placeholder="عنوان" value={title} onChange={e=>setTitle(e.target.value)} />
        <textarea placeholder="متن" value={body} onChange={e=>setBody(e.target.value)} />
        <button disabled>ارسال (نمایشی)</button>
      </div>
      <h3 style={{marginTop:16}}>آخرین اعلان‌ها</h3>
      {loading? <div>Loading…</div> : error? <div>Error</div> :
        (data?.map(n=> <div key={n.id} style={{borderBottom:'1px solid #1f2a3a', padding:'6px 0'}}>{n.title}</div>))}
    </div>
  );
}
