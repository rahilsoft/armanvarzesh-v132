
import React from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import SetEditor from './SetEditor';

export default function BlockItemEditor({ item, onChange, onRemove }:{ item:any; onChange:(patch:any)=>void; onRemove:()=>void }){
  const ex = item.exercise || { title:'حرکت انتخاب‌نشده' };
  return (
    <View style={{ borderWidth:1, borderColor:'#eee', borderRadius:10, padding:10, marginBottom:8 }}>
      <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center' }}>
        <Text style={{ fontWeight:'600' }}>{ex.title}</Text>
        <TouchableOpacity onPress={onRemove}><Text style={{ color:'#c00' }}>×</Text></TouchableOpacity>
      </View>
      <TextInput placeholder="یادداشت" value={item.note||''} onChangeText={(v)=> onChange({ note:v })}
        style={{ borderWidth:1, borderColor:'#eee', borderRadius:8, paddingHorizontal:10, height:40, marginTop:6 }} />
      {(item.sets||[]).map((s:any, i:number)=> (
        <SetEditor key={i} set={s} onChange={(patch)=>{
          const arr = [...(item.sets||[])]; arr[i] = { ...arr[i], ...patch }; onChange({ sets: arr });
        }} onRemove={()=> onChange({ sets: (item.sets||[]).filter((_:any, idx:number)=> idx!==i) })} />
      ))}
      <TouchableOpacity onPress={()=> onChange({ sets:[...(item.sets||[]), { reps:10, weight:0, rest:60, tempo:'2-1-2' }] })}>
        <Text style={{ color:'#2a6cfb' }}>+ افزودن ست</Text>
      </TouchableOpacity>
    </View>
  );
}
