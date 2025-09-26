
'use client';
import React, { useEffect, useRef } from 'react';

type Step = { title: string; body: string; media?: { kind:'image'|'video'; src:string } };
export default function Narrative({ steps }:{ steps: Step[] }){
  const ref = useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const el = ref.current; if (!el) return;
    const items = Array.from(el.querySelectorAll<HTMLElement>('[data-step]'));
    const obs = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if (e.isIntersecting) { e.target.classList.add('on'); }
        else { e.target.classList.remove('on'); }
      });
    }, { threshold: 0.4 });
    items.forEach(i=> obs.observe(i));
    return ()=> obs.disconnect();
  }, []);
  return (
    <section className="narr" ref={ref} role="region" aria-label="Story highlights">
      {steps.map((s,i)=> (
        <div key={i} className="step" data-step>
          <div className="txt">
            <h2>{s.title}</h2>
            <p>{s.body}</p>
          </div>
          {s.media && <div className="med">{s.media.kind==='image' ? <img src={s.media.src} alt="" /> : <video src={s.media.src} autoPlay loop muted playsInline/>}</div>}
        </div>
      ))}
      <style jsx>{`
        .narr{ padding: 48px 16px; }
        .step{ display:grid; grid-template-columns: 1fr; gap: 20px; align-items:center; margin: 40px 0; transform: translateY(20px); opacity:.001; transition: all .8s cubic-bezier(.22,.61,.36,1); }
        .step.on{ transform:none; opacity:1; }
        .txt h2{ margin:0 0 8px 0; line-height:1.08 }
        .txt p{ opacity:.8; margin:0 }
        .med img, .med video{ width:100%; border-radius:16px; box-shadow: 0 16px 60px rgba(0,0,0,.18); }
        @media(min-width: 960px){
          .step{ grid-template-columns: 1.1fr .9fr; }
          .step:nth-child(even){ grid-template-columns: .9fr 1.1fr; }
          .step:nth-child(even) .txt{ order:2 }
        }
        @media (prefers-reduced-motion: reduce){
          .step{ transform:none !important; opacity:1 !important; transition:none !important; }
        }
      `}</style>
    </section>
  );
}
