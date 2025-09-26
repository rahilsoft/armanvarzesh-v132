
import React from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import ExerciseRow from './ExerciseRow';

export default function DayEditor({ day, onChange, onAddExercise, onRemoveDay }:{ day:any; onChange:(patch:any)=>void; onAddExercise:()=>void; onRemoveDay:()=>void }){
  return (
    <View style={{ borderWidth:1, borderColor:'#eee', borderRadius:12, padding:12, marginBottom:12 }}>
      <View style={{ flexDirection:'row', alignItems:'center', justifyContent:'space-between' }}>
        <Text style={{ fontWeight:'700' }}>روز {day.order+1}</Text>
        <TouchableOpacity onPress={onRemoveDay}><Text style={{ color:'#c00' }}>حذف روز</Text></TouchableOpacity>
      </View>
      <TextInput placeholder="عنوان روز (اختیاری)" value={day.title||''} onChangeText={(v)=> onChange({ title:v })}
        style={{ borderWidth:1, borderColor:'#eee', borderRadius:10, paddingHorizontal:10, height:40, marginTop:8 }} />
      <View style={{ height:8 }} />
      {(day.items||[]).map((it:any, idx:number)=> (
        <ExerciseRow key={it.id||idx} item={it} onChange={(patch)=>{
          const items = [...day.items]; items[idx] = { ...items[idx], ...patch }; onChange({ items });
        }} onRemove={()=>{
          const items = (day.items||[]).filter((_:any, i:number)=> i!==idx); onChange({ items });
        }} />
      ))}
      <View style={{ height:8 }} />
      <TouchableOpacity onPress={onAddExercise}><Text style={{ color:'#2a6cfb' }}>+ افزودن حرکت</Text></TouchableOpacity>
    </View>
  );
}
