
'use client';
import React, { useEffect, useRef } from 'react';

export default function ScrollVideo({ src, start=0, end=1 }:{ src:string; start?: number; end?: number }){
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(()=>{
    const v = ref.current; if (!v) return;
    let raf = 0;
    let mounted = true;
    const onScroll = ()=>{
      if (!mounted) return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(()=>{
        const rect = v.getBoundingClientRect();
        const vh = window.innerHeight || 800;
        const visible = Math.min(1, Math.max(0, (vh - rect.top) / (vh + rect.height)));
        const t = start + (end - start) * visible;
        if (!isNaN(v.duration) && v.duration > 0){
          v.currentTime = v.duration * t;
        }
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return ()=> { mounted=false; cancelAnimationFrame(raf); window.removeEventListener('scroll', onScroll); };
  }, []);
  return <video ref={ref} src={src} muted playsInline preload="metadata" style={{display:'block', width:'100%'}}/>;
}
