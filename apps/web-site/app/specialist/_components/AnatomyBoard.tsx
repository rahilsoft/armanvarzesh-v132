'use client';
import React, { useEffect, useRef, useState } from 'react';

type Sex = 'male'|'female';
type Side = 'front'|'back';

export default function AnatomyBoard({ sex='male', onPick }:{ sex?:Sex, onPick?: (areaCode:string)=> void }){
  const [side, setSide] = useState<Side>('front');
  const [selected, setSelected] = useState<string[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  const file = `/anatomy/${sex}_${side}.svg`;

  useEffect(()=>{
    let cancelled = false;
    (async ()=>{
      const r = await fetch(file);
      const svg = await r.text();
      if (cancelled) return;
      if (ref.current){ ref.current.innerHTML = svg;
        const root = ref.current.querySelector('svg');
        if (!root) return;
        // attach listeners
        root.querySelectorAll<SVGAElement>('[data-code]').forEach((el)=>{
          const code = el.getAttribute('data-code')||'';
          el.addEventListener('click', ()=>{
            setSelected((arr)=> {
              const n = arr.includes(code)? arr.filter(x=> x!==code) : [...arr, code];
              onPick && onPick(code);
              return n;
            });
          });
          el.addEventListener('mouseenter', ()=> el.setAttribute('opacity','0.9'));
          el.addEventListener('mouseleave', ()=> el.removeAttribute('opacity'));
        });
      }
    })();
    return ()=> { cancelled = true; if (ref.current) ref.current.innerHTML = ''; };
  }, [file]);

  return (
    <div style={{ border:'1px solid #eee', borderRadius:12, padding:12 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
        <div style={{ fontWeight:700 }}>مدل عضلات — {sex==='male'?'مرد':'زن'} / {side==='front'?'جلو':'پشت'}</div>
        <div style={{ display:'flex', gap:6 }}>
          <button onClick={()=> setSide(side==='front'?'back':'front')} style={{ padding:'6px 10px', borderRadius:8 }}>چرخش</button>
        </div>
      </div>
      <div ref={ref} style={{ width:'100%' }} />
      {!!selected.length && (<div style={{ marginTop:8, display:'flex', gap:6, flexWrap:'wrap' }}>
        {selected.map((c)=> <span key={c} style={{ border:'1px solid #eee', borderRadius:100, padding:'2px 8px' }}>{c}</span>)}
      </div>)}
    </div>
  );
}
