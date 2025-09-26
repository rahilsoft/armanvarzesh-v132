
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button } from 'react-native';
import { useAuth } from '../hooks/useAuth';
const API = process.env.API_URL || 'http://localhost:8080';

export default function VIPScreen(){
  const { token } = useAuth();
  const [plans, setPlans] = useState<any[]>([]);
  useEffect(()=>{
    (async ()=>{
      const r = await fetch(`${API}/v1/plans`, { headers: { 'Authorization': `Bearer ${token}` }});
      const j = await r.json(); setPlans(j?.plans||[]);
    })();
  },[]);
  return (
    <View style={{ padding:16 }}>
      <Text style={{ fontSize:22, fontWeight:'700' }}>VIP Membership</Text>
      <FlatList data={plans} keyExtractor={(i)=>i.id} renderItem={({item})=>(
        <View style={{ borderWidth:1, padding:12, marginVertical:6 }}>
          <Text style={{ fontWeight:'700' }}>{item.name}</Text>
          <Text>{item.priceFormatted}</Text>
          <Button title="Upgrade" onPress={()=>{}} />
        </View>
      )} />
    </View>
  );
}
