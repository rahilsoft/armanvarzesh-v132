
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button } from 'react-native';
import { useAuth } from '../hooks/useAuth';
const API = process.env.API_URL || 'http://localhost:8080';

export default function ChallengesScreen(){
  const { token } = useAuth();
  const [items, setItems] = useState<any[]>([]);

  const load = async ()=>{
    const r = await fetch(`${API}/v1/challenges`, {});
    const j = await r.json(); setItems(j.items||[]);
  };
  const join = async (id:number)=>{
    await fetch(`${API}/v1/challenges/join`, { method:'POST', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type':'application/json' }, body: JSON.stringify({ challengeId: id }) });
    await load();
  };
  useEffect(()=>{ load(); },[]);
  return (
    <View style={{ padding:16 }}>
      <Text accessibilityRole='header' style={{ fontSize:22, fontWeight:'700' }}>Challenges</Text>
      <FlatList data={items} keyExtractor={(i)=> String(i.id)} renderItem={({item})=>(
        <View style={{ borderWidth:1, padding:12, marginVertical:6 }}>
          <Text style={{ fontWeight:'700' }}>{item.name}</Text>
          <Text>{item.description}</Text>
          <Button title="Join" onPress={()=> join(item.id)} />
        </View>
      )} />
    </View>
  );
}
