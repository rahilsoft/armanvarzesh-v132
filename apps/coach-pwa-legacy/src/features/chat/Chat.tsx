import React, { useState } from 'react';
import { useThreads, useMessages, useSend } from '../../../packages/data/chat/hooks';
export default function Chat(){
  const { data:threads } = useThreads();
  const [active,setActive] = useState(threads?.[0]?.id || 't-1');
  const { data:msgs, reload } = useMessages(active);
  const { mutate: send } = useSend();
  const [text,setText] = useState('');
  return (
    <div dir="rtl" style={{padding:12}}>
      <h3>چت (PWA)</h3>
      <select onChange={e=>setActive(e.target.value)} value={active}>
        {(threads||[]).map(t=> <option key={t.id} value={t.id}>{t.title}</option>)}
      </select>
      <div style={{minHeight:160, marginTop:8}}>{(msgs||[]).map(m=> <div key={m.id}>{m.from}: {m.body}</div>)}</div>
      <div style={{display:'flex', gap:8}}>
        <input value={text} onChange={e=>setText(e.target.value)} />
        <button onClick={async()=>{ await send(active, text); setText(''); reload(); }}>ارسال</button>
      </div>
    </div>
  );
}
