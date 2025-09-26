import React, { useState } from 'react';
import { View, Text, Button, TextInput } from 'react-native';
import { logMeal, daySummary } from './api';

export default function NutritionLog(){
  const [cal, setCal] = useState('500');
  const [prot, setProt] = useState('40');
  const [carb, setCarb] = useState('50');
  const [fat, setFat] = useState('15');
  const [out, setOut] = useState<any>(null);

  const onLog = async ()=>{
    const res = await logMeal([{ name:'Meal', calories: Number(cal), proteinG: Number(prot), carbsG: Number(carb), fatG: Number(fat) }]);
    setOut(res);
  };
  const onDay = async ()=>{
    const today = new Date().toISOString().slice(0,10);
    const res = await daySummary(today);
    setOut(res);
  };

  return <View style={{ padding:16 }}>
    <Text style={{ fontSize:18, fontWeight:'700' }}>Nutrition</Text>
    <TextInput value={cal} onChangeText={setCal} keyboardType="numeric" style={{ borderWidth:1, padding:8, marginVertical:4 }} placeholder="Calories" />
    <TextInput value={prot} onChangeText={setProt} keyboardType="numeric" style={{ borderWidth:1, padding:8, marginVertical:4 }} placeholder="Protein" />
    <TextInput value={carb} onChangeText={setCarb} keyboardType="numeric" style={{ borderWidth:1, padding:8, marginVertical:4 }} placeholder="Carbs" />
    <TextInput value={fat} onChangeText={setFat} keyboardType="numeric" style={{ borderWidth:1, padding:8, marginVertical:4 }} placeholder="Fat" />
    <Button title="Log Meal" onPress={onLog} />
    <Button title="Today Summary" onPress={onDay} />
    <Text selectable>{JSON.stringify(out, null, 2)}</Text>
  </View>;
}
