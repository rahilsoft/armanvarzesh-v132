import { getToday as wearableToday } from '../features/wearables';

import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, TextInput } from 'react-native';
import { useAuth } from '../hooks/useAuth';
const API = process.env.API_URL || 'http://localhost:8080';

export default function HabitsScreen(){
  const { token } = useAuth();
  const [today, setToday] = useState<any>(null);
  const [newTarget, setNewTarget] = useState('3000');

  
const load = async ()=>{
  try { const w = await wearableToday(); console.log('wearable snapshot', w); } catch(e){}

    const r = await fetch(`${API}/v1/habits/today`, { headers: { 'Authorization': `Bearer ${token}` }});
    const j = await r.json(); setToday(j);
  };
  const createWater = async ()=>{
    await fetch(`${API}/v1/habits`, { method:'POST', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type':'application/json' }, body: JSON.stringify({ type:'water', target:Number(newTarget), cadence:{daily:true}, tz:'Europe/Amsterdam' }) });
    await load();
  };
  useEffect(()=>{ load(); },[]);
  return (
    <View style={{ padding:16 }}>
      <Text accessibilityRole='header' style={{ fontSize:22, fontWeight:'700' }}>Habits — Today</Text>
      <Button title="Create Water Habit" onPress={createWater} />
      <FlatList data={today?.items||[]} keyExtractor={(i)=>String(i.habit.id)} renderItem={({item})=>(
        <View style={{ borderWidth:1, marginVertical:8, padding:12 }}>
          <Text style={{ fontWeight:'700' }}>{item.habit.type.toUpperCase()} — {Math.round(item.progress*100)}%</Text>
          <Text>Target: {item.habit.target} | Done: {item.sum}</Text>
        </View>
      )}/>
    </View>
  );
}
