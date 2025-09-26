import React from 'react';
import Head from 'next/head';
import '../../styles/booking.module.css';
import { useRouter } from 'next/router';
import { Card } from '../../../../packages/ui/components/Card';
import { Button } from '../../../../packages/ui/components/Button';
import { useWorkout, useSession } from '../../../../packages/data/workouts/hooks';

export default function WorkoutDetail(){
  const router = useRouter(); const id = String(router.query.id||'w1');
  const { data, loading } = useWorkout(id);
  const sess = useSession();
  async function start(){ await sess.start(id); }
  if(loading) return <div dir="rtl">...</div>;
  if(!data) return <div dir="rtl">یافت نشد</div>;
  return (
    <div dir="rtl">
      <Head><title>{data.title} — آرمان ورزش</title></Head>
      <link rel="stylesheet" href="/packages/ui/tokens/tokens.css" />
      <Card>
        <h1>{data.title}</h1>
        <ul>{data.exercises.map(e=> <li key={e.exerciseId}>{e.exerciseId} — {e.sets}×{e.reps}</li>)}</ul>
        {!sess.data? <Button onClick={start} busy={sess.loading}>شروع</Button> :
          <div>
            <div>جلسه: {sess.data.id} — شروع {new Date(sess.data.startedAt).toLocaleTimeString('fa-IR')}</div>
            <Button onClick={()=> sess.log(data.exercises[0].exerciseId, 1, data.exercises[0].reps)}>ثبت ست</Button>
            <Button onClick={()=> sess.complete()}>اتمام</Button>
          </div>
        }
      </Card>
    </div>
  );
}
