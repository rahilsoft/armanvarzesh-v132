import React, { useState } from 'react';
import Head from 'next/head';
import '../../styles/booking.module.css';
import { Meta } from '../../../../packages/seo/meta';
export default function SeoTool(){
  const [title,setTitle] = useState('نمونه عنوان — آرمان ورزش');
  const [desc,setDesc] = useState('توضیح کوتاه برای پیش‌نمایش.');
  const snippet = (t:string,d:string)=> (t.length<=60?'✓':'✗')+' عنوان '+t.length+'c | '+(d.length<=160?'✓':'✗')+' توضیح '+d.length+'c';
  return (
    <div dir="rtl">
      <Head><title>SEO Tool — آرمان ورزش</title></Head>
      <Meta title="SEO Tool — آرمان ورزش" description="پیش‌نمایش متا" canonical="https://armanvarzesh.example/tools/seo" noindex />
      <main id="main" style={{display:'grid',gap:12}}>
        <h1>SEO Preview</h1>
        <label>Title: <input value={title} onChange={e=> setTitle(e.target.value)} /></label>
        <label>Description: <input value={desc} onChange={e=> setDesc(e.target.value)} /></label>
        <div style={{border:'1px solid #ccc',padding:12}}>
          <p style={{color:'#1a0dab',margin:0}}>{title}</p>
          <p style={{color:'#4d5156',margin:0}}>{desc}</p>
          <small>{snippet(title,desc)}</small>
        </div>
      </main>
    </div>
  );
}
