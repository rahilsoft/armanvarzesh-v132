
'use client';
import React from 'react';
import { logConversion } from '../../lib/analytics';

export default function SignupCTA(){
  return (
    <div style={{padding:'40px', maxWidth:720, margin:'0 auto'}}>
      <h1>ثبت‌نام</h1>
      <p>برای ادامه روی دکمه زیر بزنید.</p>
      <button onClick={()=> logConversion('cta_signup_start', { from: 'vitrine' })} style={{padding:'10px 16px', borderRadius:10}}>شروع ثبت‌نام</button>
      <p style={{opacity:.7, marginTop:20}}>وقتی ثبت‌نام کامل شد، رویداد <code>signup_complete</code> را از سمت اپ/وب ثبت کنید.</p>
    </div>
  );
}
