
import React, { useEffect, useState } from 'react';
import { View, Text, Button, TextInput } from 'react-native';
import { useAuth } from '../hooks/useAuth';

const API = process.env.API_URL || 'http://localhost:8080';

export default function HydrationScreen(){
  const { token } = useAuth();
  const [ml, setMl] = useState('250');
  const [log, setLog] = useState<any>(null);
  const [sum, setSum] = useState<number>(0);

  const addLog = async ()=>{
    const r = await fetch(`${API}/v1/health/hydration`, {
      method: 'POST',
      headers: { 'Content-Type':'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ ml: Number(ml), source: 'mobile' })
    });
    const j = await r.json(); setLog(j);
    await refresh();
  };
  const refresh = async ()=>{
    const r = await fetch(`${API}/v1/health/hydration`, { headers: { 'Authorization': `Bearer ${token}` } });
    const j = await r.json();
    setSum(j?.totalMl||0);
  };
  useEffect(()=>{ refresh(); },[]);
  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: '700' }}>Hydration</Text>
      <Text style={{ marginVertical: 8 }}>Today total: {sum} ml</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <TextInput value={ml} onChangeText={setMl} keyboardType="numeric" style={{ borderWidth: 1, padding: 8, minWidth: 100 }} />
        <Button title="Add" onPress={addLog} />
      </View>
    </View>
  );
}
