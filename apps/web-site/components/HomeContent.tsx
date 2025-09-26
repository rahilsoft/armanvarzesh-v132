import React from 'react';
import data from '../content/home.json';
export default function HomeContent(){
  return (
    <section style={{padding:'24px 16px'}}>
      <div style={{maxWidth:1100, margin:'0 auto'}}>
        <h2>{data.hero.headline}</h2>
        <p>{data.hero.sub}</p>
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:16}}>
          {data.features.map((f,i)=>(
            <div key={i} style={{border:'1px solid #eee', borderRadius:12, padding:16}}>
              <h3>{f.title}</h3><p>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
