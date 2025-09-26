
import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { useAuth } from '../hooks/useAuth';
const API = process.env.API_URL || 'http://localhost:8080';

export default function CoachKpiScreen(){
  const { token } = useAuth();
  const [kpis, setKpis] = useState<any>(null);
  useEffect(()=>{
    (async ()=>{
      const r = await fetch(`${API}/v1/coach/kpis`, { headers: { 'Authorization': `Bearer ${token}` }});
      const j = await r.json(); setKpis(j);
    })();
  },[]);
  if(!kpis) return <View style={{ padding:16 }}><Text>Loading KPIs…</Text></View>;
  return (
    <View style={{ padding:16 }}>
      <Text style={{ fontSize:22, fontWeight:'700' }}>Coach KPIs</Text>
      <Text>Retention 30d: {(kpis.retention30d*100).toFixed(1)}%</Text>
      <Text>Active Trainees: {kpis.activeTrainees}</Text>
      <Text>MRR: ${kpis.mrr}</Text>
      <Text>ARPU: ${kpis.arpu}</Text>
      <Text>Sessions (7d): {kpis.sessionsBooked7d}</Text>
      <Text>Churn: {(kpis.churnRate*100).toFixed(1)}%</Text>
    </View>
  );
}
