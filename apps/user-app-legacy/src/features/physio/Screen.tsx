import React, { useEffect, useState } from 'react';
import { View, Text, Button, ScrollView, TextInput } from 'react-native';

const API = process.env.EXPO_PUBLIC_PHYSIO_URL || 'http://localhost:4061';

export default function RehabToday() {
  const [plan, setPlan] = useState<any>(null);
  const [score, setScore] = useState('5');
  const [sessionId, setSessionId] = useState<string>('');

  useEffect(() => {
    fetch(`${API}/physio/plan/u1`).then(r=>r.json()).then(setPlan).catch(console.error);
  }, []);

  useEffect(()=>{
    if (plan?.today?.session?.id) setSessionId(plan.today.session.id);
  }, [plan]);

  const submitPain = async () => {
    if (!sessionId) return;
    await fetch(`${API}/physio/session/${sessionId}/pain`, {
      method:'POST',
      headers:{'content-type':'application/json'},
      body: JSON.stringify({ score: Number(score) })
    });
    const updated = await fetch(`${API}/physio/plan/u1`).then(r=>r.json());
    setPlan(updated);
  };

  const complete = async () => {
    if (!sessionId) return;
    await fetch(`${API}/physio/session/${sessionId}/complete`, { method:'POST' });
    const updated = await fetch(`${API}/physio/plan/u1`).then(r=>r.json());
    setPlan(updated);
  };

  return (
    <ScrollView style={{ padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: '600' }}>Today Rehab</Text>
      <Text style={{ fontSize: 14, color: '#666' }}>{plan?.protocol?.name || 'No plan'}</Text>
      <View style={{ marginTop: 12 }}>
        <Text style={{ fontWeight: '600' }}>Pain (VAS 0-10)</Text>
        <TextInput value={score} onChangeText={setScore} keyboardType="number-pad" style={{ borderWidth:1, padding:8, borderRadius:8 }}/>
        <Button title="Log Pain" onPress={submitPain} />
      </View>
      <View style={{ marginTop: 12 }}>
        <Button title="Complete Session" onPress={complete} />
      </View>
      <View style={{ marginTop: 16 }}>
        <Text style={{ fontWeight: '600' }}>Raw</Text>
        <Text selectable>{JSON.stringify(plan, null, 2)}</Text>
      </View>
    </ScrollView>
  );
}
