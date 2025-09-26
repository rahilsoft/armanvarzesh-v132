import React, { useState } from 'react';
import Head from 'next/head';
import './styles/booking.module.css';
import { Card } from '../../packages/ui/components/Card';
import { Button } from '../../packages/ui/components/Button';
import { useSchedule, useScheduleAdd, useSetStatus } from '../../packages/data/schedule/hooks';

export default function SchedulePage(){
  const { data, loading, reload } = useSchedule();
  const { mutate: add, loading: adding } = useScheduleAdd();
  const { mutate: setStatus } = useSetStatus();
  const [date,setDate] = useState(()=> new Date().toISOString().slice(0,16));
  const [workoutId,setWorkoutId] = useState('w1');
  return (
    <div dir="rtl">
      <Head><title>زمان‌بندی — آرمان ورزش</title></Head>
      <link rel="stylesheet" href="/packages/ui/tokens/tokens.css" />
      <h1>زمان‌بندی</h1>
      <Card>
        <input type="datetime-local" value={date} onChange={e=> setDate(e.target.value)} />
        <input value={workoutId} onChange={e=> setWorkoutId(e.target.value)} />
        <Button busy={adding} onClick={async()=>{ await add(new Date(date).toISOString(), workoutId); await reload(); }}>افزودن</Button>
      </Card>
      <Card>
        {loading? '...' : (data||[]).map(s=> <div key={s.id}>
          {new Date(s.date).toLocaleString('fa-IR')} — {s.workoutId} — {s.status}
          <Button onClick={async()=>{ await setStatus(s.id, 'done'); await reload(); }}>انجام شد</Button>
        </div>)}
      </Card>
    </div>
  );
}
