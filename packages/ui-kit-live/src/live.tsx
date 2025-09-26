
import React, { useEffect, useState } from 'react';
import { LiveClient, LiveEvent } from '@arman/client-live';

export function LiveView({ baseUrl, roomId, userId }:{ baseUrl:string; roomId:string; userId:string; }){
  const [events, setEvents] = useState<LiveEvent[]>([]);
  const [count, setCount] = useState(1);
  const [text, setText] = useState('');
  useEffect(()=>{
    const client = new LiveClient(baseUrl);
    client.join(roomId, userId, undefined, (e)=>{
      setEvents(prev=>[...prev, e]);
      if (e.type==='counter') setCount(e.count);
    });
    return ()=> client.leave();
  }, [baseUrl, roomId, userId]);
  return (<div style={{border:'1px solid #ddd', borderRadius:8, padding:12}}>
    <div style={{display:'flex',justifyContent:'space-between'}}>
      <strong>Live</strong><span>👥 {count}</span>
    </div>
    <div style={{height:160,overflow:'auto',marginTop:8,background:'#fafafa',padding:8}}>
      {events.map((e,i)=> <div key={i}>{renderEvent(e)}</div>)}
    </div>
    <div style={{marginTop:8,display:'flex',gap:8}}>
      <input placeholder="Send a comment..." value={text} onChange={e=>setText(e.target.value)} />
      <button onClick={()=>{/* wired in app layer via client*/}}>Send</button>
    </div>
    <div style={{marginTop:8,display:'flex',gap:8}}>
      <button>👍</button><button>🔥</button><button>👏</button>
    </div>
  </div>);
}
function renderEvent(e: LiveEvent){
  switch(e.type){
    case 'joined': return <em>{e.userId} joined</em>;
    case 'left': return <em>{e.userId} left</em>;
    case 'comment': return <span><b>{e.userId}:</b> {e.text}</span>;
    case 'reaction': return <span>{e.userId} reacted {e.emoji}</span>;
    case 'counter': return <span>👥 {e.count}</span>;
    default: return null;
  }
}

export function ConsentModal(){ return <div>Consent Required</div>; }
export function ArchivePlayer({url}:{url:string}){ return <video src={url} controls style={{width:'100%'}}/> }
