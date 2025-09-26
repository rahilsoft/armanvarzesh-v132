import React, { useRef, useState } from 'react';
import Head from 'next/head';
import '../styles/booking.module.css';
import { Card } from '../../../packages/ui/components/Card';
import { Button } from '../../../packages/ui/components/Button';
import { useChat, useRooms } from '../../../packages/data/chat/hooks';
import { upload } from '../../../packages/media/upload';
import { transcode } from '../../../packages/media/worker';

export default function ChatPage(){
  const { rooms } = useRooms();
  const [active,setActive] = useState<string>('r_support');
  const { messages, sendText, sendMedia } = useChat({ id:'u1', name:'You', role:'user' }, active);
  const [text,setText] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  async function send(){
    if(text.trim().length===0) return;
    await sendText('admin', text.trim());
    setText('');
  }
  async function onFile(e: React.ChangeEvent<HTMLInputElement>){
    const f = e.target.files?.[0]; if(!f) return;
    const { url } = await upload(f);
    const kind = f.type.startsWith('image') ? 'image' : f.type.startsWith('audio') ? 'audio' : 'video';
    await sendMedia('admin', kind as any, url);
    setTimeout(()=>{ if(fileRef.current) fileRef.current.value=''; }, 0);
  }

  return (
    <div dir="rtl">
      <Head><title>چت — آرمان ورزش</title></Head>
      <link rel="stylesheet" href="/packages/ui/tokens/tokens.css" />
      <h1>چت</h1>
      <div style={{display:'grid', gridTemplateColumns:'220px 1fr', gap:12}}>
        <Card>
          <b>گفتگوها</b>
          <ul>{(rooms||[]).map(r=> <li key={r.id}><button onClick={()=> setActive(r.id)}>{r.title}</button></li>)}</ul>
        </Card>
        <Card>
          <div style={{minHeight:260, display:'grid', gap:6}}>
            {(messages||[]).map(m=> <div key={m.id} style={{textAlign: m.from==='u1'?'left':'right'}}>
              <small>{new Date(m.at).toLocaleTimeString('fa-IR')}</small>
              <div style={{display:'inline-block', padding:'6px 10px', border:'1px solid #ddd', borderRadius:8, marginInlineStart:6}}>
                {m.kind==='text'? m.body : <a href={m.body} target="_blank" rel="noreferrer">{m.kind}</a>}
              </div>
            </div>)}
          </div>
          <div style={{display:'flex', gap:8, marginTop:8}}>
            <input value={text} onChange={e=> setText(e.target.value)} placeholder="پیام…" />
            <input type="file" ref={fileRef} onChange={onFile} aria-label="send media" />
            <Button onClick={send}>ارسال</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
