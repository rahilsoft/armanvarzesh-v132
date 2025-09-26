export const metadata = { title: 'سوالات پرتکرار' };
export default function FAQ() {
  const items = [
    {q:'چطور مربی انتخاب کنم؟', a:'پس از ثبت‌نام از بخش مربیان می‌توانید بر اساس تخصص/امتیاز انتخاب کنید.'},
    {q:'بازپرداخت چگونه است؟', a:'در صورت عدم رضایت تا ۷۲ ساعت امکان بازگشت وجه وجود دارد.'},
    {q:'داده‌های من امن است؟', a:'بله. رمزنگاری سمت-سرور و ارتباطات امن برقرار است.'},
  ];
  return (
    <main>
      <h1>سوالات پرتکرار</h1>
      <div className="list">
        {items.map((x,i)=>(
          <details key={i}><summary>{x.q}</summary><p>{x.a}</p></details>
        ))}
      </div>
      {/* FAQ JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context":"https://schema.org",
          "@type":"FAQPage",
          "mainEntity": items.map(x=>({
            "@type":"Question",
            "name":x.q,
            "acceptedAnswer":{"@type":"Answer","text":x.a}
          }))
        })
      }} />
      <style jsx>{`
        main{padding:48px 16px;max-width:900px;margin:0 auto}
        details{border:1px solid #e5e7eb;border-radius:12px;padding:12px 16px;margin:8px 0}
        summary{cursor:pointer;font-weight:600}
        p{margin:8px 0 0}
      `}</style>
    </main>
  );
}
