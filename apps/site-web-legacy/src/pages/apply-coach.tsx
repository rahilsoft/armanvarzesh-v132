import React, { useState } from 'react';
import Head from 'next/head';
import './styles/booking.module.css';
import { Card } from '../../packages/ui/components/Card';
import { Button } from '../../packages/ui/components/Button';

export default function ApplyCoach(){
  const [name,setName] = useState(''); const [exp,setExp] = useState(''); const [tags,setTags] = useState('strength,hiit');
  const [msg,setMsg] = useState('');
  async function submit(){ setMsg('ارسال شد (موک)'); }
  return (
    <div dir="rtl">
      <Head><title>همکاری به عنوان مربی — آرمان ورزش</title></Head>
      <link rel="stylesheet" href="/packages/ui/tokens/tokens.css" />
      <Card>
        <h1>درخواست همکاری مربی</h1>
        <input placeholder="نام" value={name} onChange={e=> setName(e.target.value)} />
        <input placeholder="سابقه (سال)" value={exp} onChange={e=> setExp(e.target.value)} />
        <input placeholder="تگ‌ها" value={tags} onChange={e=> setTags(e.target.value)} />
        <Button onClick={submit}>ارسال</Button>
        {msg && <p>{msg}</p>}
      </Card>
    </div>
  );
}
