import React from 'react';
import { useChat } from '../../../packages/data/chat/hooks';
export default function Chat(){
  const { messages, sendText } = useChat({ id:'u1', name:'You', role:'user' }, 'r_support');
  const [text,setText] = React.useState('');
  return (
    <div dir="rtl" style={{padding:12}}>
      <h3>چت (PWA)</h3>
      <div style={{minHeight:180}}>{(messages||[]).map(m=> <div key={m.id}>{m.kind==='text'? m.body : m.kind}</div>)}</div>
      <input value={text} onChange={e=> setText(e.target.value)} /><button onClick={()=>{ if(text.trim().length){ sendText('admin', text.trim()); setText(''); } }}>ارسال</button>
    </div>
  );
}
