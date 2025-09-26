import React from 'react';

export default function CTA() {
  return (
    <section className="cta2">
      <div className="box">
        <h2>آماده‌ای شروع کنی؟</h2>
        <p>همین حالا ثبت‌نام کن و برنامهٔ اختصاصی بگیر.</p>
        <a className="btn primary" href="/app">شروع کن</a>
      </div>
      <style jsx>{`
        .cta2{padding:64px 16px}
        .box{max-width:900px;margin:0 auto;border:1px solid #111;padding:32px;border-radius:24px;text-align:center}
        h2{margin:0 0 12px;font-size:32px}
        p{margin:0 0 16px;opacity:.9}
        .btn{padding:12px 20px;border-radius:999px;border:1px solid #ddd;text-decoration:none}
        .btn.primary{background:#111;color:#fff;border-color:#111}
      `}</style>
    </section>
  );
}
