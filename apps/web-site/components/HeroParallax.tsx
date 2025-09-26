
'use client';
import React, { useEffect, useRef } from 'react';

export default function HeroParallax({ title, subtitle, layers }:{ title:string; subtitle:string; layers:{ src:string; depth:number; alt?:string }[] }){
  const ref = useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const el = ref.current; if (!el) return;
    const onMove = (e: MouseEvent)=>{
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width/2, cy = r.top + r.height/2;
      const dx = (e.clientX - cx)/r.width, dy = (e.clientY - cy)/r.height;
      const items = el.querySelectorAll<HTMLElement>('[data-depth]');
      items.forEach(it=>{
        const d = parseFloat(it.dataset.depth || '0');
        it.style.transform = `translate3d(${dx * -15 * d}px, ${dy * -15 * d}px, 0)`;
      });
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return ()=> window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <section ref={ref} className="hero" role="banner" aria-label="Hero">
      <h1>{title}</h1>
      <p className="sub">{subtitle}</p>
      <div className="layers">
        {layers.map((l,i)=> <img key={i} data-depth={l.depth} src={l.src} alt={l.alt||''} aria-hidden={true} />)}
      </div>
      <style jsx>{`
        .hero{ position:relative; overflow:hidden; padding:96px 16px 48px; text-align:center }
        h1{ font-size: clamp(28px, 4.5vw, 56px); margin: 0; line-height:1.05 }
        .sub{ opacity:.75; font-size: clamp(14px, 2vw, 20px); margin-top:12px }
        .layers{ position:relative; height: clamp(220px, 40vw, 420px); pointer-events:none }
        .layers img{ position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); will-change:transform; filter: drop-shadow(0 10px 40px rgba(0,0,0,.25)); max-width: 60vw; }
        @media (prefers-reduced-motion: reduce){
          .layers img{ transition:none !important; transform:translate(-50%,-50%) !important; }
        }
      `}</style>
    </section>
  );
}
