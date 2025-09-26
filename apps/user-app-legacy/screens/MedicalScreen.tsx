
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button } from 'react-native';
import { useAuth } from '../hooks/useAuth';
const API = process.env.API_URL || 'http://localhost:8080';

export default function MedicalScreen(){
  const { token } = useAuth();
  const [tests, setTests] = useState<any[]>([]);
  const [bundles, setBundles] = useState<any[]>([]);

  useEffect(()=>{
    (async ()=>{
      const t = await fetch(`${API}/v1/medical/tests`).then(r=>r.json());
      const b = await fetch(`${API}/v1/medical/bundles`).then(r=>r.json());
      setTests(t.items||[]);
      setBundles(b.items||[]);
    })();
  },[]);

  const book = async (bundleId:number)=>{
    await fetch(`${API}/v1/medical/book`, { method:'POST', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type':'application/json' }, body: JSON.stringify({ bundleId }) });
    alert('Booked request sent');
  };

  return (
    <View style={{ padding:16 }}>
      <Text accessibilityRole='header' style={{ fontSize:22, fontWeight:'700' }}>Medical Tests</Text>
      <Text style={{ marginTop:8, fontWeight:'700' }}>Bundles</Text>
      <FlatList data={bundles} keyExtractor={(i)=> String(i.id)} renderItem={({item})=>(
        <View style={{ borderWidth:1, padding:12, marginVertical:6 }}>
          <Text style={{ fontWeight:'700' }}>{item.name}</Text>
          <Text>{item.description}</Text>
          <Text>{(item.tests||[]).map((t:any)=> t.name).join(', ')}</Text>
          <Button title="Book" onPress={()=> book(item.id)} />
        </View>
      )} />
      <Text style={{ marginTop:8, fontWeight:'700' }}>All Tests</Text>
      <FlatList data={tests} keyExtractor={(i)=> String(i.id)} renderItem={({item})=>(
        <View style={{ borderWidth:1, padding:12, marginVertical:6 }}>
          <Text>{item.name} — €{(item.priceCents/100).toFixed(2)}</Text>
        </View>
      )} />
    </View>
  );
}
