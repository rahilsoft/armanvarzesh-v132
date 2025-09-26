import React from 'react';
export function FormStepper({ step, total, onPrev, onNext }:{ step:number; total:number; onPrev:()=>void; onNext:()=>void }){
  return (
    <div style={{display:'flex', alignItems:'center', gap:8}}>
      <button onClick={onPrev} disabled={step<=1} aria-label="prev">◀</button>
      <div>گام {step} از {total}</div>
      <button onClick={onNext} disabled={step>=total} aria-label="next">▶</button>
    </div>
  );
}
