
import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import { useAuth } from '../hooks/useAuth';
const API = process.env.API_URL || 'http://localhost:8080';

export default function ActivitiesScreen(){
  const { token } = useAuth();
  const [session, setSession] = useState<any>(null);
  const [summary, setSummary] = useState<any>(null);

  const startRun = async ()=>{
    const r = await fetch(`${API}/v1/activities/sessions`, { method:'POST', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type':'application/json' }, body: JSON.stringify({ sport:'run' }) });
    const j = await r.json(); setSession(j.session);
  };
  const fetchSummary = async ()=>{
    if(!session) return;
    const r = await fetch(`${API}/v1/activities/${session.id}/summary`, { headers: { 'Authorization': `Bearer ${token}` } });
    const j = await r.json(); setSummary(j);
  };

  useEffect(()=>{ if(session){ fetchSummary(); } }, [session]);
  return (
    <View style={{ padding:16 }}>
      <Text accessibilityRole='header' style={{ fontSize:22, fontWeight:'700' }}>Outdoor Activities</Text>
      <Button title="Start Run" onPress={startRun} />
      {summary && (
        <View style={{ borderWidth:1, marginTop:12, padding:12 }}>
          <Text style={{ fontWeight:'700' }}>Summary</Text>
          <Text>Distance: {summary.totals?.distance_m} m</Text>
          <Text>Elevation: {summary.totals?.elevation_gain_m} m</Text>
        </View>
      )}
    </View>
  );
}
