import { useCallback, useEffect, useRef, useState } from 'react';
import * as api from './adapter';
import type { ChatMsg, ChatRoom, ChatUser } from './schemas';

export function useChat(user?: ChatUser, room?: string){
  const [messages,setMessages] = useState<ChatMsg[]>([]);
  const [presence,setPresence] = useState<Record<string,ChatUser>>({});
  const ready = useRef(false);
  useEffect(()=>{
    if(ready.current) return;
    api.connect(user);
    api.onMessage((m)=>{ if(!room || m.room===room || m.to===user?.id || m.from===user?.id){ setMessages((arr)=> [...arr, m]); } });
    api.onPresence((u)=> setPresence(p=> ({...p, [u.id]: u})));
    ready.current = true;
  },[user?.id, room]);
  const sendText = useCallback((to:string, body:string)=> api.sendText(to, body, room), [room]);
  const sendMedia = useCallback((to:string, kind:'image'|'audio'|'video', url:string)=> api.sendMedia(to, kind, url, room), [room]);
  return { messages, presence, sendText, sendMedia };
}

export function useRooms(){
  const [rooms,setRooms] = useState<ChatRoom[]|null>(null);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState<Error|null>(null);
  const reload = useCallback(async()=>{ try{ setLoading(true); setError(null); setRooms(await api.listRooms()); } catch(e:any){ setError(e);} finally{ setLoading(false);} },[]);
  useEffect(()=>{ reload(); },[reload]);
  return { rooms, loading, error, reload };
}
