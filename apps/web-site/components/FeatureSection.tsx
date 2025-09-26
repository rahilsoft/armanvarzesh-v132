import React from 'react';

type Item = { title: string; desc: string; };

export default function FeatureSection({id}:{id?:string}) {
  const items: Item[] = [
    { title: 'مربی حرفه‌ای', desc: 'رزرو جلسه، برنامهٔ تمرینی پویا، آنالیز پیشرفت.' },
    { title: 'تغذیهٔ هوشمند', desc: 'اهداف ماکرو، اسکن بارکد و پیشنهاد خوردنی‌ها.' },
    { title: 'مسابقه و چالش', desc: 'چالش‌های هفتگی، امتیاز، نشان‌ها و رتبه‌بندی.' },
    { title: 'دوره‌های آموزشی', desc: 'دوره‌های مربیان با ویدیو، سرفصل و گواهی پایان.' },
  ];
  return (
    <section id={id} className="features">
      <div className="grid">
        {items.map((x,i)=>(
          <div className="card" key={i}>
            <h3>{x.title}</h3>
            <p>{x.desc}</p>
          </div>
        ))}
      </div>
      <style jsx>{`
        .features{padding:48px 16px}
        .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;max-width:1100px;margin:0 auto}
        .card{border:1px solid #e5e7eb;border-radius:16px;padding:20px}
        h3{margin:0 0 8px}
        p{margin:0;opacity:.9}
      `}</style>
    </section>
  );
}
