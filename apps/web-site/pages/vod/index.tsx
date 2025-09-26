import Link from 'next/link';
import { useEffect, useState } from 'react';

type Vod = { id:string; room:string; url?:string; filepath?:string; status:string; startedAt?:string; endedAt?:string; duration?:number };

export default function VodIndex(){
  const [items, setItems] = useState<Vod[]>([]);
  useEffect(()=>{
    const api = process.env.NEXT_PUBLIC_API_BASE || '';
    fetch(api + '/vod').then(r=>r.json()).then(setItems).catch(()=>{});
  },[]);
  return <div style={{padding:24}}>
    <h2>VOD</h2>
    <ul>
      {items.map(v => (<li key={v.id}>
        <Link href={'/vod/'+encodeURIComponent(v.room)}>{v.room}</Link> — {v.status} — {v.url || v.filepath || '-'}
      </li>))}
    </ul>
  </div>;
}
