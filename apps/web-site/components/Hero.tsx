'use client';
import React from 'react';

export default function Hero() {
  return (
    <section className="hero">
      <div className="inner">
        <h1>Arman Varzesh</h1>
        <p>Coaching • Nutrition • Recovery — one powerful platform.</p>
        <div className="cta">
          <a className="btn primary" href="/app">شروع کن</a>
          <a className="btn" href="#learn-more">بیشتر بدانید</a>
        </div>
      </div>
      <style jsx>{`
        .hero{padding:96px 16px;text-align:center}
        .inner{max-width:1000px;margin:0 auto}
        h1{font-size:48px;line-height:1.1;margin:0 0 12px}
        p{font-size:18px;opacity:.9;margin:0 0 24px}
        .cta{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
        .btn{padding:12px 20px;border-radius:999px;border:1px solid #ddd;text-decoration:none}
        .btn.primary{background:#111;color:#fff;border-color:#111}
      `}</style>
    </section>
  );
}
