
import React from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import SetEditor from './SetEditor';

export default function ExerciseRow({ item, onChange, onRemove }:{ item:any; onChange:(patch:any)=>void; onRemove:()=>void }){
  const ex = item.exercise || { name:'حرکت انتخاب‌نشده' };
  return (
    <View style={{ borderWidth:1, borderColor:'#f2f2f2', borderRadius:10, padding:10, marginBottom:8 }}>
      <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center' }}>
        <Text style={{ fontWeight:'600' }}>{ex.name}</Text>
        <TouchableOpacity onPress={onRemove}><Text style={{ color:'#c00' }}>حذف</Text></TouchableOpacity>
      </View>
      <Text style={{ fontSize:12, color:'#666', marginTop:4 }}>{[ex.muscleGroup, ex.equipment].filter(Boolean).join(' • ')}</Text>
      <TextInput placeholder="یادداشت تمرین (اختیاری)" value={item.note||''} onChangeText={(v)=> onChange({ note:v })}
        style={{ borderWidth:1, borderColor:'#eee', borderRadius:8, paddingHorizontal:10, height:40, marginTop:8 }} />
      <View style={{ height:8 }} />
      {(item.sets||[]).map((s:any, i:number)=> (
        <SetEditor key={i} set={s} onChange={(patch)=>{
          const next = [...(item.sets||[])]; next[i] = { ...next[i], ...patch }; onChange({ sets: next });
        }} onRemove={()=>{
          const next = (item.sets||[]).filter((_:any, idx:number)=> idx!==i); onChange({ sets: next });
        }} />
      ))}
      <TouchableOpacity onPress={()=> onChange({ sets: [...(item.sets||[]), { reps:10, weight:0, rest:60, tempo:'2-1-2' }] })}>
        <Text style={{ color:'#2a6cfb' }}>+ افزودن ست</Text>
      </TouchableOpacity>
    </View>
  );
}
