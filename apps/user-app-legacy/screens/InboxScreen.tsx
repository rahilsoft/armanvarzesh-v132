
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useAuth } from '../hooks/useAuth';
const API = process.env.API_URL || 'http://localhost:8080';

type InboxItem = { id:number; type:string; payload:any; deeplink?:string; readAt?:string; createdAt:string };

export default function InboxScreen(){
  const { token } = useAuth();
  const [items, setItems] = useState<InboxItem[]>([]);
  const [cursor, setCursor] = useState<number|undefined>(undefined);

  const load = async (reset=false)=>{
    const qs = new URLSearchParams(reset? {} : (cursor? { cursor: String(cursor) } : {})).toString();
    const r = await fetch(`${API}/v1/inbox${qs?`?${qs}`:''}`, { headers: { 'Authorization': `Bearer ${token}` }});
    const j = await r.json();
    setItems(reset? j.items : [...items, ...j.items]);
    setCursor(j.nextCursor || undefined);
  };
  const markRead = async (id:number)=>{
    await fetch(`${API}/v1/inbox/${id}/read`, { method:'POST', headers: { 'Authorization': `Bearer ${token}` }});
    setItems(items.map(x=> x.id===id ? { ...x, readAt: new Date().toISOString() } : x));
  };

  useEffect(()=>{ load(true); },[]);
  return (
    <View style={{ padding:16 }}>
      <Text accessibilityRole='header' style={{ fontSize:22, fontWeight:'700' }}>Notifications Inbox</Text>
      <FlatList data={items} keyExtractor={(i)=> String(i.id)} renderItem={({item})=>(
        <TouchableOpacity onPress={()=> markRead(item.id)} style={{ borderWidth:1, padding:12, marginVertical:6, backgroundColor: item.readAt? '#eee':'#fff' }}>
          <Text style={{ fontWeight:'700' }}>{item.type}</Text>
          <Text numberOfLines={2}>{JSON.stringify(item.payload)}</Text>
          {item.deeplink ? <Text>{item.deeplink}</Text> : null}
        </TouchableOpacity>
      )}
      onEndReached={()=> cursor && load(false)}
      onEndReachedThreshold={0.2}
      />
    </View>
  );
}
