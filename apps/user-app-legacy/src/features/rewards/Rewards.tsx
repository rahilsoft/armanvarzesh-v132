import React, { useEffect, useState } from 'react';
import { View, Text, Button, ScrollView } from 'react-native';

const API = process.env.EXPO_PUBLIC_REWARDS_URL || 'http://localhost:4067';

export default function RewardsScreen(){
  const [mine, setMine] = useState<any>(null);
  const [vip, setVip] = useState<any>(null);
  const auth = { authorization: 'Bearer dev-u1' };

  const refresh = async ()=>{
    const m = await fetch(`${API}/rewards/mine`, { headers: auth }).then(r=>r.json());
    const v = await fetch(`${API}/rewards/vip`, { headers: auth }).then(r=>r.json());
    setMine(m); setVip(v);
  };

  useEffect(()=>{ refresh(); },[]);

  const simulateSession = async ()=>{
    await fetch(`${API}/rewards/ingest`, { method:'POST', headers:{ 'content-type':'application/json', ...auth }, body: JSON.stringify({ type:'SESSION_COMPLETED', amount:10, idempotencyKey:`sess-${Date.now()}` }) });
    refresh();
  };

  return <ScrollView style={{ padding:16 }}>
    <Text style={{ fontSize:18, fontWeight:'700' }}>Rewards</Text>
    <Button title="Simulate Session Completed" onPress={simulateSession} />
    <View style={{ marginTop:12 }}>
      <Text style={{ fontWeight:'600' }}>My Points</Text>
      <Text selectable>{JSON.stringify(mine, null, 2)}</Text>
    </View>
    <View style={{ marginTop:12 }}>
      <Text style={{ fontWeight:'600' }}>VIP</Text>
      <Text selectable>{JSON.stringify(vip, null, 2)}</Text>
    </View>
  </ScrollView>;
}
