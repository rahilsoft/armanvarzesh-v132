import React from 'react';
import Head from 'next/head';
import '../../../styles/booking.module.css';
import { useRouter } from 'next/router';
import { Card } from '../../../../packages/ui/components/Card';
import { Button } from '../../../../packages/ui/components/Button';
import { useWorkoutSession, useCompleteSession } from '../../../../packages/data/workouts/hooks';

export default function WorkoutDetail(){
  const router = useRouter();
  const id = String(router.query.id||'s-1');
  const { data, loading, error, reload } = useWorkoutSession(id);
  const { mutate: complete, loading: completing } = useCompleteSession();
  return (
    <div dir="rtl">
      <Head><title>جلسه تمرین — آرمان ورزش</title></Head>
      <link rel="stylesheet" href="/packages/ui/tokens/tokens.css" />
      <h1>جلسه تمرین</h1>
      {loading? <p>...</p> : error? <p>خطا</p> : !data? <p>یافت نشد</p> :
        <Card>
          <ul>{data.exercises.map(e=> <li key={e.id}>{e.name} — {e.sets}×{e.reps} — استراحت {e.restSec}s</li>)}</ul>
          <Button busy={completing} onClick={async()=>{ await complete(id); reload(); }}>اتمام جلسه</Button>
        </Card>
      }
    </div>
  );
}
