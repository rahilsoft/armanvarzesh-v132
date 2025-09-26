const MODE = (process.env.DATA_MODE || 'mock') as 'api'|'mock';
import type { ChatMsg, ChatRoom, ChatUser } from './schemas';
import { wsConnect } from './ws';
import { fetcher } from '../../network/fetcher';

let socket: ReturnType<typeof wsConnect> | null = null;
let self: ChatUser = { id:'u1', name:'You', role:'user' };

type Handlers = { message?: (m:ChatMsg)=>void; presence?: (u:ChatUser)=>void };
let handlers: Handlers = {};

export function connect(current?: ChatUser){
  if(current) self = current;
  if(MODE==='mock'){
    socket = wsConnect('ws://mock-chat');
    socket.on((evt)=>{
      if(evt.type==='message' && handlers.message) handlers.message(evt.payload as ChatMsg);
      if(evt.type==='presence' && handlers.presence) handlers.presence(evt.payload as ChatUser);
    });
    // announce presence
    socket.send('presence', self);
    return { ok:true };
  }else{
    // real ws: use WebSocket API (placeholder)
    return { ok:true };
  }
}

export function onMessage(fn:(m:ChatMsg)=>void){ handlers.message = fn; }
export function onPresence(fn:(u:ChatUser)=>void){ handlers.presence = fn; }

export async function sendText(to:string, body:string, room?:string){
  const msg: ChatMsg = { id: 'm_'+Math.random().toString(36).slice(2), from: self.id, to, room, kind:'text', body, at: new Date().toISOString() };
  if(MODE==='mock'){ socket?.send('message', msg); return msg; }
  const res = await fetcher('/api/bff/chat/send',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ to, body, room })}); if(!res.ok) throw new Error('Network'); return await res.json();
}

export async function sendMedia(to:string, kind:'image'|'audio'|'video', url:string, room?:string){
  const msg: ChatMsg = { id: 'm_'+Math.random().toString(36).slice(2), from: self.id, to, room, kind, body: url, at: new Date().toISOString() };
  if(MODE==='mock'){ socket?.send('message', msg); return msg; }
  const res = await fetcher('/api/bff/chat/send-media',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ to, kind, url, room })}); if(!res.ok) throw new Error('Network'); return await res.json();
}

export async function listRooms(){
  if(MODE==='mock'){
    const rooms: ChatRoom[] = [
      { id:'r_support', title:'پشتیبانی', members:['u1','admin'], lastAt: new Date().toISOString(), lastMsg:'سلام! چطور کمک کنم؟' },
      { id:'r_coach', title:'Coach Arash', members:['u1','c1'], lastAt: new Date().toISOString(), lastMsg:'تمرین فردا: HIIT' }
    ];
    return rooms;
  }
  const res = await fetcher('/api/bff/chat/rooms'); if(!res.ok) throw new Error('Network'); return await res.json();
}
