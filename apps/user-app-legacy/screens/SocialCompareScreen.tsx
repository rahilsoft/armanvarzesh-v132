
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useAuth } from '../hooks/useAuth';
const API = process.env.API_URL || 'http://localhost:8080';

export default function SocialCompareScreen(){
  const { token } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  useEffect(()=>{
    (async ()=>{
      const r = await fetch(`${API}/v1/social/compare?with=friends`, { headers: { 'Authorization': `Bearer ${token}` }});
      const j = await r.json(); setItems(j?.items||[]);
    })();
  },[]);
  return (
    <View style={{ padding:16 }}>
      <Text style={{ fontSize:22, fontWeight:'700' }}>Friends Compare</Text>
      <FlatList data={items} keyExtractor={(i)=>i.userId+''} renderItem={({item})=>(
        <View style={{ borderWidth:1, marginVertical:6, padding:12 }}>
          <Text style={{ fontWeight:'700' }}>{item.displayName}</Text>
          <Text>Score: {item.score} | Rank: {item.rank}</Text>
        </View>
      )} />
    </View>
  );
}
