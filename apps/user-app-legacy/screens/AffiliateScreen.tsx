
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useAuth } from '../hooks/useAuth';
const API = process.env.API_URL || 'http://localhost:8080';

export default function AffiliateScreen(){
  const { token } = useAuth();
  const [me, setMe] = useState<any>(null);
  const [leaders, setLeaders] = useState<any[]>([]);
  useEffect(()=>{
    (async ()=>{
      const r1 = await fetch(`${API}/v1/affiliate/me`, { headers: { 'Authorization': `Bearer ${token}` }});
      const r2 = await fetch(`${API}/v1/affiliate/leaderboard`);
      setMe(await r1.json()); const j2 = await r2.json(); setLeaders(j2?.items||[]);
    })();
  },[]);
  return (
    <View style={{ padding:16 }}>
      <Text style={{ fontSize:22, fontWeight:'700' }}>Affiliate</Text>
      {me && (
        <View style={{ borderWidth:1, padding:12, marginVertical:6 }}>
          <Text>Code: {me.code}</Text>
          <Text>Clicks: {me.clicks} • Signups: {me.signups} • Conversions: {me.conversions}</Text>
          <Text>Revenue: ${me.revenue}</Text>
        </View>
      )}
      <Text style={{ fontSize:18, marginTop:8 }}>Leaderboard</Text>
      <FlatList data={leaders} keyExtractor={(i)=> String(i.userId)} renderItem={({item})=>(
        <View style={{ borderWidth:1, padding:12, marginVertical:6 }}>
          <Text style={{ fontWeight:'700' }}>{item.displayName}</Text>
          <Text>${item.revenue}</Text>
        </View>
      )} />
    </View>
  );
}
