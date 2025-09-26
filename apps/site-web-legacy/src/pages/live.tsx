import React, { useState } from 'react';
import Head from 'next/head';
import '../../styles/booking.module.css';
import { Card } from '../../../packages/ui/components/Card';
import { Button } from '../../../packages/ui/components/Button';
import { useLiveRooms, useCreateRoom } from '../../../packages/data/live/hooks';

export default function LivePage(){
  const { data, loading, error, reload } = useLiveRooms();
  const { mutate: create, loading: creating } = useCreateRoom();
  const [title,setTitle] = useState('Live Workout');
  const [start,setStart] = useState(new Date().toISOString());

  return (
    <div dir="rtl">
      <Head><title>کلاس‌های زنده — آرمان ورزش</title></Head>
      <link rel="stylesheet" href="/packages/ui/tokens/tokens.css" />
      <h1>کلاس‌های زنده</h1>
      <Card>
        <h3>ایجاد کلاس</h3>
        <input value={title} onChange={e=> setTitle(e.target.value)} placeholder="عنوان" />
        <input value={start} onChange={e=> setStart(e.target.value)} placeholder="ISO زمان" />
        <Button busy={creating} onClick={async()=>{ await create(title,start); reload(); }}>ایجاد</Button>
      </Card>
      <Card>
        <h3>فهرست</h3>
        {loading? '...' : error? 'خطا' :
          (data||[]).map(r=> <div key={r.id}><b>{r.title}</b> — مربی: {r.coach} — وضعیت: {r.status} — <a href={r.url||'#'} target="_blank" rel="noreferrer">ورود</a></div>)
        }
      </Card>
    </div>
  );
}
