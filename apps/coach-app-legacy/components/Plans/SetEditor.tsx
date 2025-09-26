
import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

export default function SetEditor({ set, onChange, onRemove }:{ set:any; onChange:(patch:any)=>void; onRemove:()=>void }){
  return (
    <View style={{ flexDirection:'row', gap:8, alignItems:'center', marginBottom:6 }}>
      <TextInput placeholder="تکرار" keyboardType="numeric" value={String(set.reps||'')}
        onChangeText={(v)=> onChange({ reps: Number(v)||0 })}
        style={st.in} />
      <TextInput placeholder="وزن" keyboardType="numeric" value={String(set.weight||'')}
        onChangeText={(v)=> onChange({ weight: Number(v)||0 })}
        style={st.in} />
      <TextInput placeholder="استراحت (ث)" keyboardType="numeric" value={String(set.rest||'')}
        onChangeText={(v)=> onChange({ rest: Number(v)||0 })}
        style={st.in} />
      <TextInput placeholder="تمپو" value={String(set.tempo||'')}
        onChangeText={(v)=> onChange({ tempo: v })}
        style={[st.in,{flex:1}]} />
      <TouchableOpacity onPress={onRemove}><Text style={{ color:'#c00' }}>×</Text></TouchableOpacity>
    </View>
  );
}

const st = {
  in: { borderWidth:1, borderColor:'#eee', borderRadius:8, paddingHorizontal:8, height:36, width:70 }
};
