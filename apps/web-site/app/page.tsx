import Image from 'next/image';
import Hero from '../components/Hero';
import FeatureSection from '../components/FeatureSection';
import CTA from '../components/CTA';
import AnimatedSection from '../components/AnimatedSection';

export default async function Home() {
  return (
    <main dir="rtl">
      <Hero />
      <AnimatedSection>
        <section id="main" className="hero-media">
          <div className="wrap">
            <div className="img">
              <Image src="/hero.jpg" width={1280} height={720} alt="Arman Varzesh App Preview" priority />
            </div>
            <div className="copy">
              <h2>تمرکز بر تجربه</h2>
              <p>سرعت، سادگی و وضوح؛ vitrin با استانداردهای Apple-style برای معرفی حرفه‌ای سرویس‌ها.</p>
            </div>
          </div>
        </section>
      </AnimatedSection>
      <AnimatedSection>
        <FeatureSection id="learn-more" />
      </AnimatedSection>
      <AnimatedSection>
        <CTA />
      </AnimatedSection>

      <style>{`
        .hero-media{padding:48px 16px}
        .wrap{display:grid;grid-template-columns:1.2fr 1fr;gap:24px;align-items:center;max-width:1200px;margin:0 auto}
        .img{border-radius:24px;overflow:hidden;border:1px solid #eee}
        .copy h2{margin:0 0 12px}
        .copy p{margin:0;opacity:.9}
        @media (max-width: 900px){
          .wrap{grid-template-columns:1fr;gap:16px}
        }
      `}</style>
      <div style={{marginTop:16}}>
        <a href="/specialist" style={{ color:"#2563eb" }}>پنل کارشناس حرکت اصلاحی</a>
      </div>
    </main>
  );
}
