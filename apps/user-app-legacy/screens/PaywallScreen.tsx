
import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import { useAuth } from '../hooks/useAuth';

const API = process.env.API_URL || 'http://localhost:8080';

export default function PaywallScreen(){
  const { token } = useAuth();
  const [plans, setPlans] = useState<any[]>([]);
  useEffect(()=>{
    (async ()=>{
      const r = await fetch(`${API}/v1/plans`, { headers: { 'Authorization': `Bearer ${token}` }});
      const j = await r.json(); setPlans(j?.plans||[]);
    })();
  },[]);
  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: '700' }}>Upgrade</Text>
      <FlatList data={plans} keyExtractor={(i)=>i.id} renderItem={({item})=>(
        <View style={{ padding:12, borderWidth:1, marginVertical:6 }}>
          <Text>{item.name} — {item.priceFormatted}</Text>
          <Button title="Choose" onPress={()=>{/* integrate native purchase */}} />
        </View>
      )}/>
      <Button title="Restore Purchases" onPress={async()=>{
        await fetch(`${API}/v1/subscriptions/restore`, { method:'POST', headers: { 'Authorization': `Bearer ${token}` } });
      }} />
    </View>
  );
}
