
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics';

type TimerProps = { type:'EMOM'|'HIIT'; params:any };
export default function ProtocolTimer({ type, params }: TimerProps){
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0); // seconds
  const [round, setRound] = useState(1);
  const intRef = useRef<any>(null);

  const total = type==='EMOM' ? (params.minutes||20)*60 : ((params.rounds||8) * ((params.work||20) + (params.rest||10)));

  useEffect(()=>{
    if (running){
      intRef.current = setInterval(()=>{
        setElapsed(e=> e+1);
      }, 1000);
    } else if (intRef.current){ clearInterval(intRef.current); intRef.current = null; }
    return ()=>{ if (intRef.current) clearInterval(intRef.current); };
  }, [running]);

  useEffect(()=>{
    if (!running) return;
    if (type==='EMOM'){
      if (elapsed>0 && elapsed % (params.every||60) === 0){ Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); setRound(r=> r+1); }
    } else {
      const cycle = (params.work||20) + (params.rest||10);
      const pos = elapsed % cycle;
      if (pos === 0) { setRound(r=> r+1); Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); } // cycle change
      else if (pos === (params.work||20)) { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning); } // switch work→rest
    }
    if (elapsed >= total){ setRunning(false); }
  }, [elapsed]);

  const mmss = (s:number)=> `${Math.floor(s/60)}`.padStart(2,'0') + ':' + `${s%60}`.padStart(2,'0');

  return (
    <View style={{ borderWidth:1, borderColor:'#eee', borderRadius:12, padding:12 }}>
      <Text style={{ fontWeight:'700' }}>{type} Timer</Text>
      <Text style={{ fontSize:32, fontVariant:['tabular-nums'], marginVertical:6 }}>{mmss(elapsed)} / {mmss(total)}</Text>
      <Text style={{ opacity:.7 }}>Round {round}</Text>
      <View style={{ height:8 }} />
      <View style={{ flexDirection:'row', gap:8 }}>
        <TouchableOpacity onPress={()=> setRunning(s=> !s)}><Text style={{ padding:10, borderRadius:8, backgroundColor:'#111', color:'#fff' }}>{running? 'توقف':'شروع'}</Text></TouchableOpacity>
        <TouchableOpacity onPress={()=>{ setRunning(false); setElapsed(0); setRound(1); }}><Text style={{ padding:10, borderRadius:8, backgroundColor:'#f2f2f2', color:'#111' }}>ریست</Text></TouchableOpacity>
      </View>
    </View>
  );
}
