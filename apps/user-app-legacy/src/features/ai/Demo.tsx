import React, { useState } from 'react';
import { View, Text, Button, ScrollView } from 'react-native';

const API = process.env.EXPO_PUBLIC_AI_URL || 'http://localhost:4073';

export default function AIDemo(){
  const [res, setRes] = useState<any>(null);
  const auth = { authorization:'Bearer dev-u1' };

  const suggest = async ()=>{
    const body = { lastSets:[{exerciseId:'sq', weight:80, reps:6, rpe:7.5}], fatigue:0.3, hr:128, seed:123 };
    const r = await fetch(`${API}/ai/suggest-next-set`, { method:'POST', headers:{ 'content-type':'application/json', ...auth }, body: JSON.stringify(body) }).then(r=>r.json());
    setRes(r);
  };

  const readiness = async ()=>{
    const r = await fetch(`${API}/ai/readiness?hrv=65&sleepHours=7.5&load=0.6&soreness=0.2`, { headers: auth }).then(r=>r.json());
    setRes(r);
  };

  const match = async ()=>{
    const userFeatures = [0.8,0.2,0.2,0.7,0.1];
    const r = await fetch(`${API}/ai/coach-match`, { method:'POST', headers:{ 'content-type':'application/json' }, body: JSON.stringify({ userFeatures }) }).then(r=>r.json());
    setRes(r);
  };

  return <ScrollView style={{ padding:16 }}>
    <Text style={{ fontSize:18, fontWeight:'700' }}>AI Demo</Text>
    <Button title="Suggest Next Set" onPress={suggest} />
    <Button title="Readiness" onPress={readiness} />
    <Button title="Coach Match" onPress={match} />
    <View style={{ marginTop:12 }}>
      <Text selectable>{JSON.stringify(res, null, 2)}</Text>
    </View>
  </ScrollView>
}
