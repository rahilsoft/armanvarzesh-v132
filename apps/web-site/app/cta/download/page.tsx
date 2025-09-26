
'use client';
import React from 'react';
import { logConversion } from '../../lib/analytics';

export default function DownloadCTA(){
  return (
    <div style={{padding:'40px', maxWidth:720, margin:'0 auto'}}>
      <h1>دانلود اپ</h1>
      <p>برای دانلود اپ روی دکمه زیر بزنید.</p>
      <a href="#" onClick={()=> logConversion('app_download', { from: 'vitrine' })} style={{padding:'10px 16px', borderRadius:10, display:'inline-block', background:'#111', color:'#fff'}}>دانلود</a>
    </div>
  );
}
