import React, { useEffect, useState } from 'react';
import { View, Text, Button, TextInput, ScrollView } from 'react-native';
import { startSession, logSetOptimistic, completeSession } from './api';
import { offlineQueue } from '../../lib/net/offlineQueue';

export default function WorkoutFlow(){
  const [session, setSession] = useState<any>(null);
  const [weight, setWeight] = useState('60');
  const [reps, setReps] = useState('8');
  const [log, setLog] = useState<string[]>([]);

  useEffect(()=>{ offlineQueue.start(); return ()=> offlineQueue.stop(); },[]);

  const onStart = async ()=>{
    const s = await startSession();
    setSession(s);
    setLog(l=>[...l, 'Started session '+s.id]);
  };
  const onLog = ()=>{
    if (!session) return;
    const r = logSetOptimistic(session.id, { exerciseId:'sq', weight: Number(weight), reps: Number(reps), rpe: 7.5 });
    setLog(l=>[...l, `Set queued #${r.clientId} → ${weight}kg x ${reps}`]);
  };
  const onComplete = async ()=>{
    if (!session) return;
    const res = await completeSession(session.id);
    setLog(l=>[...l, 'Completed session '+JSON.stringify(res)]);
    setSession(null);
  };

  return <ScrollView style={{ padding:16 }}>
    <Text style={{ fontSize:18, fontWeight:'700' }}>Workout Session</Text>
    <Button title="Start Session" onPress={onStart} />
    <View style={{ flexDirection:'row', marginTop:8 }}>
      <TextInput value={weight} onChangeText={setWeight} keyboardType="numeric" style={{ borderWidth:1, padding:8, marginRight:8, width:80 }} />
      <TextInput value={reps} onChangeText={setReps} keyboardType="numeric" style={{ borderWidth:1, padding:8, width:80 }} />
      <Button title="Log Set" onPress={onLog} />
    </View>
    <Button title="Complete Session" onPress={onComplete} />
    {log.map((x,i)=>(<Text key={i}>{x}</Text>))}
  </ScrollView>;
}
