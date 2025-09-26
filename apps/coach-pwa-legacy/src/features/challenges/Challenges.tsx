import React from 'react';
import { useChallenges } from '../../../packages/data/challenges/hooks';
export default function Challenges(){
  const { data, loading } = useChallenges();
  return (
    <div dir="rtl" style={{padding:12}}>
      <h3>چالش‌ها (PWA)</h3>
      {loading? '...' : (data||[]).map(c=> <div key={c.id}>{c.title}</div>)}
    </div>
  );
}
