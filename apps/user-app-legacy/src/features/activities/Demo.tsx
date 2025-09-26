import React, { useState } from 'react';
import { View, Text, Button, ScrollView } from 'react-native';

const API = process.env.EXPO_PUBLIC_ACTIVITIES_URL || 'http://localhost:4075';
const auth = { authorization:'Bearer dev-u1' };

export default function ActivitiesDemo(){
  const [activityId, setActivityId] = useState<string>('');
  const [out, setOut] = useState<any>(null);

  const start = async ()=>{
    const r = await fetch(`${API}/activities/start`, { method:'POST', headers:{ 'content-type':'application/json', ...auth }, body: JSON.stringify({}) }).then(r=>r.json());
    setActivityId(r.activityId);
  };
  const tick = async ()=>{
    if (!activityId) return;
    const lat = 52.357 + Math.random()*0.002;
    const lng = 4.868 + Math.random()*0.002;
    await fetch(`${API}/activities/${activityId}/tick`, { method:'POST', headers:{ 'content-type':'application/json' }, body: JSON.stringify({ lat, lng, ts: Date.now() }) });
  };
  const end = async ()=>{
    if (!activityId) return;
    const r = await fetch(`${API}/activities/${activityId}/end`, { method:'POST', headers:{ 'content-type':'application/json', ...auth }, body: JSON.stringify({ userKg: 75 }) }).then(r=>r.json());
    setOut(r);
  };

  return <ScrollView style={{ padding:16 }}>
    <Text style={{ fontSize:18, fontWeight:'700' }}>Activities</Text>
    <Button title="Start Activity" onPress={start} />
    <Button title="Send Tick" onPress={tick} />
    <Button title="End Activity" onPress={end} />
    <Text selectable style={{ marginTop:12 }}>{JSON.stringify({ activityId, out }, null, 2)}</Text>
  </ScrollView>;
}
