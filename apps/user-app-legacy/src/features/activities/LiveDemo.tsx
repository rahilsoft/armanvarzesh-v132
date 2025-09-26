import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Button, ScrollView } from 'react-native';

const API = process.env.EXPO_PUBLIC_ACTIVITIES_URL || 'http://localhost:4075';

function sleep(ms:number){ return new Promise(r=>setTimeout(r,ms)); }

export default function LiveRunDemo(){
  const [activityId, setActivityId] = useState<string|null>(null);
  const [log, setLog] = useState<string[]>([]);
  const auth = { authorization:'Bearer dev-u1' };
  const runningRef = useRef(false);

  const start = async ()=>{
    const res = await fetch(`${API}/activities/start`, { method:'POST', headers:{ 'content-type':'application/json', ...auth }, body: JSON.stringify({ routeId: 'route-vondel-loop' }) }).then(r=>r.json());
    setActivityId(res.id); setLog(l=>[...l, 'Started '+res.id]);
  };

  const simulateTicks = async ()=>{
    if (!activityId) return;
    runningRef.current = true;
    const pts = [[52.357,4.868],[52.358,4.869],[52.359,4.870],[52.360,4.871],[52.361,4.869],[52.360,4.867],[52.359,4.866],[52.358,4.867]];
    for (let i=0;i<pts.length && runningRef.current;i++){
      const [lat,lng] = pts[i];
      await fetch(`${API}/activities/${activityId}/tick`, { method:'POST', headers:{ 'content-type':'application/json' }, body: JSON.stringify({ lat, lng, elevM: 15+i }) });
      await sleep(800);
    }
  };

  const end = async ()=>{
    if (!activityId) return;
    const res = await fetch(`${API}/activities/${activityId}/end`, { method:'POST', headers: auth }).then(r=>r.json());
    setLog(l=>[...l, 'Ended '+JSON.stringify(res)]);
    runningRef.current = false;
    setActivityId(null);
  };

  return <ScrollView style={{ padding:16 }}>
    <Text style={{ fontSize:18, fontWeight:'700' }}>Live Run Demo</Text>
    <Button title="Start" onPress={start} />
    <Button title="Simulate Ticks" onPress={simulateTicks} />
    <Button title="End" onPress={end} />
    <View style={{ marginTop:12 }}>
      {log.map((x,i)=>(<Text key={i}>{x}</Text>))}
    </View>
  </ScrollView>
}
