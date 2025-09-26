import Image from 'next/image';
import HeroParallax from '../components/HeroParallax';
import { useFlag } from '../lib/flags';
import JsonLd from '../components/JsonLd';
import Narrative from '../components/Narrative';
import { Gate } from '../components/Gate';
import { useI18n } from '../lib/i18n';
import SignedImage from '../components/SignedImage';
import Hero from '../components/Hero';
import FeatureSection from '../components/FeatureSection';
import CTA from '../components/CTA';
import HomeContent from '../components/HomeContent';
import EnqueueDemo from '../components/EnqueueDemo';
import AnimatedSection from '../components/AnimatedSection';

// __ARMAN_VITRINE_INJECT__


function selectVariants(tiles: any[], seed: string){
  // Group by logical id from data.id (fallback: index)
  const groups = new Map<string, any[]>();
  tiles.forEach((t, i)=>{
    const id = t?.id || t?.data?.id || String(i);
    const list = groups.get(id) || [];
    list.push(t);
    groups.set(id, list);
  });
  function rng(s: string){
    let h = 2166136261;
    for (let i=0;i<s.length;i++){ h ^= s.charCodeAt(i); h += (h<<1) + (h<<4) + (h<<7) + (h<<8) + (h<<24); }
    return (h >>> 0) / 2**32;
  }
  const out: any[] = [];
  for (const [id, list] of groups){
    if (list.length === 1){ out.push(normalize(list[0])); continue; }
    const r = rng(seed + id);
    const total = list.reduce((a,b)=> a + (b.weight ?? 100), 0);
    let cum = 0;
    let chosen = list[0];
    for (const v of list){
      cum += (v.weight ?? 100);
      if (r * total <= cum){ chosen = v; break; }
    }
    out.push(normalize(chosen));
  }
  return out;
}

function normalize(t:any){
  // Normalize both DB tiles (top-level) and file JSON tiles (nested)
  return t?.data && t.data.title ? t.data : t;
}


      // detect preview mode via ?preview=<token>
      const token = (typeof searchParams !== 'undefined' && (searchParams?.preview || searchParams?.pv || '')) as string;
      const headers: any = token ? { 'X-Preview-Token': token } : {};
      async function loadTilesRemoteWithHeaders(){
        try{
          const url = process.env.NEXT_PUBLIC_CONTENT_SERVICE_URL;
          if (!url) return null;
          const q = `query Vitrine($includeDraft:Boolean){ vitrineTiles{ id type title{fa en} subtitle{fa en} cta{href label{fa en}} media{kind src alt{fa en}} animation{trigger effect durationMs} metricsKey } tiles(page:"home", includeDraft:$includeDraft){ id page type state variant weight data } }`;
          const res = await fetch(url, { method:'POST', headers:{'Content-Type':'application/json', ...headers}, body: JSON.stringify({ query: q, variables:{ includeDraft: !!token } }) , cache:'no-store'});
          if (!res.ok) return null;
          const j = await res.json();
          const data = j?.data?.tiles?.length ? j.data.tiles.map((t:any)=> ({ ...t.data, variant: t.variant, weight: t.weight })) : j?.data?.vitrineTiles || null;
          return data;
        }catch(e){ return null; }
      }


function PreviewBadge({ token }: { token?: string }){
  if (!token) return null;
  return (
    <div style={{position:'fixed', top:12, right:12, zIndex:9999, background:'rgba(255,255,255,0.9)', color:'#111', padding:'6px 10px', borderRadius:8, boxShadow:'0 4px 20px rgba(0,0,0,.15)'}}>
      پیش‌نمایش
    </div>
  );
}



async function loadNarr(locale:'fa'|'en'='fa'){
  try{
    const mod = await import('../content/narrative.json');
    const data = (mod as any).default || (mod as any);
    return data[locale] || data['fa'];
  }catch(e){ return []; }
}

async function loadHero(){
  try{
    const mod = await import('../content/hero.json');
    return mod.default || (mod as any);
  }catch(e){ return null; }
}

async function loadTilesRemote(){
  try{
    const url = process.env.NEXT_PUBLIC_CONTENT_SERVICE_URL;
    if (!url) return null;
    const q = `query Vitrine{ vitrineTiles{ id type title{fa en} subtitle{fa en} cta{href label{fa en}} media{kind src alt{fa en}} animation{trigger effect durationMs} metricsKey } }`;
    const res = await fetch(url, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ query: q }) , cache:'no-store'});
    if (!res.ok) return null;
    const j = await res.json();
    return j?.data?.vitrineTiles || null;
  }catch(e){ return null; }
}

import fs from 'fs';
import path from 'path';
import { ShowcaseGrid } from '../components/ShowcaseGrid';

function loadTiles() {
  try {
    const p = path.join(process.cwd(), 'content', 'vitrine.tiles.json');
    const raw = fs.readFileSync(p, 'utf-8');
    const json = JSON.parse(raw);
    return json.tiles || [];
  } catch (e) { return []; }
}


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

      <style jsx>{`
        .hero-media{padding:48px 16px}
        .wrap{display:grid;grid-template-columns:1.2fr 1fr;gap:24px;align-items:center;max-width:1200px;margin:0 auto}
        .img{border-radius:24px;overflow:hidden;border:1px solid #eee}
        .copy h2{margin:0 0 12px}
        .copy p{margin:0;opacity:.9}
        @media (max-width: 900px){
          .wrap{grid-template-columns:1fr;gap:16px}
        }
      `}</style>
    <div style={{marginTop:16}}><a href="/specialist" style={{ color:"#2563eb" }}>پنل کارشناس حرکت اصلاحی</a></div></main>
  )
}


<section id="main" className="from-s3" style={{padding:'24px 16px'}}>
  <div className="wrap" style={{maxWidth:1200, margin:'0 auto'}}>
    <h3>نمونهٔ تصویر از MinIO/S3 (Signed URL)</h3>
    <SignedImage fileKey="public/images/test.webp" alt="Sample" width={800} height={450} />
  </div>
</section>

<EnqueueDemo />

      <section id="main" style={{marginTop:40}}>
        {/* SEO */}
        
        <JsonLd data={{
          "@context":"https://schema.org",
          "@type":"WebSite",
          "url": process.env.NEXT_PUBLIC_SITE_URL || "",
          "potentialAction": {
            "@type": "SearchAction",
            "target": (process.env.NEXT_PUBLIC_SITE_URL || "") + "/?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        }} />
    
        {/* Hero (flag) */}
        <Gate flag="hero_enabled">{(()=>{ const hero = (await loadHero()); if (!hero) return null; const { t } = require('../lib/i18n'); return (<HeroParallax title={t(hero.title)} subtitle={t(hero.subtitle)} layers={(hero.layers||[]).map((l:any)=>({ src:l.src, depth:l.depth||1 }))} />); })()}</Gate>

        {/* Narrative */
        {(()=>{ const narr = await loadNarr('fa'); return <Gate flag="narrative_enabled"><Narrative steps={narr} /></Gate>; })()}

        /* A/B selection */}
        (()=>{ 
      const tiles = (await loadTilesRemoteWithHeaders()) || (await loadTilesRemote()) || loadTiles();
      let seed = '';
      if (typeof document !== 'undefined'){
        const m = document.cookie.match(/(?:^|; )abid=([^;]+)/);
        if (m) seed = decodeURIComponent(m[1]);
        else { seed = Math.random().toString(36).slice(2); document.cookie = `abid=${seed}; path=/; max-age=31536000`; }
      } else {
        seed = 'server';
      }
     return (<>
          <ShowcaseGrid tiles={selectVariants(tiles, seed)} locale="fa" />
          
        {/* Schema.org — ItemList of tiles */}
        {(()=>{
          const items = selectVariants(tiles, seed).slice(0,10).map((t:any, i:number)=> ({
            "@type":"ListItem", "position": i+1,
            "url": (typeof location!=='undefined' ? location.origin : (process.env.NEXT_PUBLIC_SITE_URL||'')) + (t?.cta?.href||'/'),
            "name": (t?.title?.fa || t?.title?.en || '')
          }));
          return <JsonLd data={{ "@context":"https://schema.org", "@type":"ItemList", "itemListElement": items }} />;
        })()}
    
        </>) })()
      </section>
    