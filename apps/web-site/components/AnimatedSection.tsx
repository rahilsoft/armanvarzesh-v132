'use client';
import React, { useEffect, useRef, useState } from 'react';

export default function AnimatedSection({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisible(true);
    }, { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={visible ? 'reveal visible' : 'reveal'}>
      {children}
      <style jsx>{`
        .reveal{opacity:0; transform: translateY(24px); transition: opacity .6s ease, transform .6s ease}
        .reveal.visible{opacity:1; transform:none}
      `}</style>
    </div>
  );
}
