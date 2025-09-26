
import React, { useState } from 'react';
import { View, Text, Button, TextInput } from 'react-native';
import { countdown, emom } from '../features/timer/timerCore';

export default function TimerScreen(){
  const [sec, setSec] = useState('60');
  const [left, setLeft] = useState(0);
  const [round, setRound] = useState(0);

  return (
    <View style={{ padding:16 }}>
      <Text style={{ fontSize:22, fontWeight:'700' }}>Timer Suite</Text>
      <TextInput value={sec} onChangeText={setSec} keyboardType="numeric" style={{ borderWidth:1, padding:8, marginVertical:8 }} />
      <Button title="Start REST" onPress={()=> countdown(Number(sec), setLeft, ()=>{}) } />
      <View style={{ height:12 }} />
      <Button title="Start EMOM x5" onPress={()=> emom(Number(sec), 5, setLeft, (r)=> setRound(r), ()=>{}) } />
      <Text style={{ marginTop:12 }}>Left: {left}s / Round: {round}</Text>
    </View>
  );
}
