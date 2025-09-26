import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export default function ChatOverlay({ token }: { token: string }){
  const [messages, setMessages] = useState<{from:string;message:string;ts:number}[]>([]);
  const [input, setInput] = useState('');
  const [joined, setJoined] = useState(false);
  const sockRef = useRef<Socket | null>(null);
  const room = typeof window !== 'undefined' ? window.location.pathname.split('/').pop() || 'public' : 'public';

  useEffect(() => {
    const ws = (process.env.NEXT_PUBLIC_WS_URL || '') + '/live';
    const s = io(ws, { transports: ['websocket'] });
    sockRef.current = s;
    s.on('connect', () => {
      s.emit('join', { room, token }, () => setJoined(true));
    });
    s.on('chat', (m) => setMessages((prev) => [...prev.slice(-199), m]));
    s.on('reaction', (r) => setMessages((prev)=>[...prev, {from:'*',message:`reaction:${r.type}`,ts:r.ts}]));
    s.on('presence', (e) => setMessages((prev)=>[...prev, {from:'system',message:`${e.identity} ${e.type}`,ts:Date.now()}]));
    s.on('kicked', (e) => { setMessages((prev)=>[...prev,{from:'system',message:`you were kicked`,ts:Date.now()}]); s.disconnect(); });
    return () => { s.disconnect(); };
  }, [token]);

  function send(){
    if (!input.trim()) return;
    sockRef.current?.emit('chat', { room, message: input.trim() });
    setInput('');
  }
  function react(type: string){
    sockRef.current?.emit('reaction', { room, type });
  }

  return <div style={{position:'fixed', right:12, bottom:12, width:320, background:'#111', color:'#fff', padding:12, borderRadius:8, opacity:0.9}}>
    <div style={{height:200, overflowY:'auto', fontSize:12, marginBottom:8}}>
      {messages.map((m,i)=>(<div key={i}><b>{m.from}:</b> {m.message}</div>))}
    </div>
    <div style={{display:'flex', gap:6}}>
      <input value={input} onChange={e=>setInput(e.target.value)} placeholder="message…" style={{flex:1}} />
      <button onClick={send}>Send</button>
    </div>
    <div style={{marginTop:6, display:'flex', gap:6}}>
      <button onClick={()=>react('❤️')}>❤️</button>
      <button onClick={()=>react('👏')}>👏</button>
      <button onClick={()=>react('🔥')}>🔥</button>
    </div>
  </div>;
}
