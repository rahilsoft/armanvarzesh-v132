import React, { useState } from 'react';
import Head from 'next/head';
import { AuthProvider, useAuth } from '../../../packages/auth/context';
import { Guard } from '../../../packages/security/guards/react';

import '../../styles/booking.module.css';
import { Card } from '../../../packages/ui/components/Card';
import { Button } from '../../../packages/ui/components/Button';
import { useChallenges, useLeaderboard, useJoin } from '../../../packages/data/challenges/hooks';

export default function ChallengesPageGuardedWrapper(){
  return (<AuthProvider><ChallengesPageInner/></AuthProvider>);
}

function ChallengesPageInner(){
  const { role } = useAuth();
function ChallengesPage(){
  const { data, loading, error, reload } = useChallenges();
  const [active,setActive] = useState<string>('c1');
  const { data:board, reload:rb } = useLeaderboard(active);
  const { mutate: join, loading: joining } = useJoin();
  return (
    <div dir="rtl">
      <Guard role={role} feature="challenges" action="view" fallback={<p>دسترسی غیرمجاز</p>}>
      <Head><title>چالش‌ها — آرمان ورزش</title></Head>
      <link rel="stylesheet" href="/packages/ui/tokens/tokens.css" />
      <h1>چالش‌ها</h1>
      <Card>
        {loading? '...' : error? 'خطا' :
          <div>
            <div style={{display:'grid', gap:8}}>
              {(data||[]).map(c=> <div key={c.id} onClick={()=> setActive(c.id)} style={{cursor:'pointer'}}>
                <b>{c.title}</b> — {new Date(c.start).toLocaleDateString('fa-IR')} تا {new Date(c.end).toLocaleDateString('fa-IR')} {active===c.id?'(فعال)':''}
                {!c.joined && <Button style={{marginInlineStart:8}} busy={joining} onClick={async()=>{ await join(c.id); reload(); }}>پیوستن</Button>}
              </div>)}
            </div>
          </div>
        }
      </Card>
      <Card>
        <h3>جدول برندگان</h3>
        {(board||[]).map(r=> <div key={r.rank}>{r.rank}. {r.user} — {r.score}</div>)}
        <Button onClick={rb} style={{marginTop:8}}>تازه‌سازی</Button>
      </Card>
    </Guard>
    </div>
  );
}

