import React, { useState } from 'react';
import Head from 'next/head';
import './styles/booking.module.css';
import { Card } from '../../packages/ui/components/Card';
import { Button } from '../../packages/ui/components/Button';
import { useProtocols, useAssign, usePlans } from '../../packages/data/physio/hooks';

export default function PhysioPage(){
  const { data: protocols, loading } = useProtocols();
  const { mutate: assign, loading: assigning } = useAssign();
  const { data: plans, reload } = usePlans();
  const [notes,setNotes] = useState('');
  return (
    <div dir="rtl">
      <Head><title>فیزیوتراپی — آرمان ورزش</title></Head>
      <link rel="stylesheet" href="/packages/ui/tokens/tokens.css" />
      <h1>پروتکل‌های اصلاحی</h1>
      <Card>
        {loading? '...' : (protocols||[]).map(p=> <div key={p.id} style={{marginBottom:8}}>
          <b>{p.title}</b> — focus: {p.focus} — مراحل: {p.steps.join('، ')}
          <div style={{display:'flex', gap:8, marginTop:6}}>
            <input placeholder="یادداشت" value={notes} onChange={e=> setNotes(e.target.value)} />
            <Button busy={assigning} onClick={async()=>{ await assign(p.id, notes); await reload(); }}>انتساب</Button>
          </div>
        </div>)}
      </Card>
      <Card>
        <h3>برنامه‌های من</h3>
        {(plans||[]).length===0? 'هنوز برنامه‌ای ندارید' : (plans||[]).map(pl=> <div key={pl.id}>{pl.createdAt} — پروتکل: {pl.protocolId} — adherence: {pl.adherence}%</div>)}
      </Card>
    </div>
  );
}
