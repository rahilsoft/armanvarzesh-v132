
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useAuth } from '../hooks/useAuth';

const API = process.env.API_URL || 'http://localhost:8080';

export default function ExploreScreen(){
  const { token } = useAuth();
  const [filters, setFilters] = useState({ difficulty:'', goal:'', time:'', sort:'trending' });
  const [items, setItems] = useState<any[]>([]);
  const load = async ()=>{
    const qs = new URLSearchParams(Object.entries(filters).filter(([_,v])=>v)).toString();
    const r = await fetch(`${API}/v1/feed${qs?`?${qs}`:''}`, { headers: { 'Authorization': `Bearer ${token}` }});
    const j = await r.json(); setItems(j?.items||[]);
  };
  useEffect(()=>{ load(); }, [filters]);
  const chip = (k:string, v:string, label:string)=> (
    <TouchableOpacity onPress={()=> setFilters((f:any)=> ({...f, [k]: f[k]===v? '' : v})) } style={{ padding:8, borderWidth:1, marginRight:8, borderRadius:14 }}>
      <Text>{label}{filters[k]===v?' ✓':''}</Text>
    </TouchableOpacity>
  );
  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: '700' }}>Explore</Text>
      <View style={{ flexDirection:'row', marginVertical: 8 }}>
        {chip('difficulty','beginner','Beginner')}
        {chip('difficulty','intermediate','Intermediate')}
        {chip('difficulty','advanced','Advanced')}
      </View>
      <View style={{ flexDirection:'row', marginVertical: 8 }}>
        {chip('goal','fatloss','Fat Loss')}
        {chip('goal','hypertrophy','Hypertrophy')}
        {chip('goal','endurance','Endurance')}
      </View>
      <FlatList data={items} keyExtractor={(i)=>i.id+''} renderItem={({item})=>(
        <View style={{ padding:12, borderWidth:1, marginVertical:6 }}>
          <Text style={{ fontWeight:'700' }}>{item.title}</Text>
          <Text>{item.summary}</Text>
        </View>
      )} />
    </View>
  );
}
