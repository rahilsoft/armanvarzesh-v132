import React, { useMemo, useState } from 'react';
import Head from 'next/head';
import '../../styles/booking.module.css';
import Link from 'next/link';
import { Card } from '../../../../packages/ui/components/Card';
import { Button } from '../../../../packages/ui/components/Button';
import { Meta } from '../../../../packages/seo/meta';
import { useCoaches } from '../../../../packages/data/coaches/hooks';
import type { CoachFilter } from '../../../../packages/data/coaches/schemas';
import { useMatch } from '../../../../packages/data/matching/hooks';

export default function CoachesDirectory(){
  const [q,setQ] = useState(''); const [gender,setGender] = useState<'male'|'female'|'any'>('any'); const [priceMax,setPriceMax] = useState(200000);
  const filter: CoachFilter = useMemo(()=> ({ q, gender, priceMax }), [q, gender, priceMax]);
  const { data, loading } = useCoaches(filter);
  const { data: mres, run, loading: matching } = useMatch();
  return (
    <div dir="rtl">
      <Head><title>فهرست مربی‌ها — آرمان ورزش</title></Head>
      <Meta title="فهرست مربی‌ها — آرمان ورزش" description="جستجو و فیلتر مربی" canonical="https://armanvarzesh.example/coaches" />
      <h1>مربی‌ها</h1>
      <Card>
        <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
          <input placeholder="جستجو" value={q} onChange={e=> setQ(e.target.value)} />
          <select value={gender} onChange={e=> setGender(e.target.value as any)}>
            <option value="any">همه</option><option value="male">مرد</option><option value="female">زن</option>
          </select>
          <input type="number" value={priceMax} onChange={e=> setPriceMax(Number(e.target.value))} />
          <Button onClick={()=> run({ goal:'weight-loss', genderPref: gender, priceMax })} busy={matching}>یافتن مربی مناسب</Button>
        </div>
      </Card>
      <div style={{display:'grid', gap:12, marginTop:12}}>
        {loading? '...' : (data||[]).map(c=> <Card key={c.id}>
          <b>{c.name}</b> — ⭐ {c.rating} — {c.price} {c.currency}
          <div>تگ‌ها: {c.tags.join('، ')}</div>
          <Link href={`/coaches/${c.id}`}>مشاهده پروفایل</Link>
        </Card>)}
      </div>
      {mres && <Card><h3>نتایج مچینگ</h3><ul>{mres.map(r=> <li key={r.coachId}>{r.coachId}: {r.score}</li>)}</ul></Card>}
    </div>
  );
}
