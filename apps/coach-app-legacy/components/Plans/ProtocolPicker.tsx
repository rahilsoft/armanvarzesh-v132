
import React from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';

const PRESETS = [
  { name:'5x5', params:{ sets:5, reps:5, rest:120 } },
  { name:'GVT', params:{ sets:10, reps:10, rest:60 } },
  { name:'EMOM', params:{ minutes:20, every:60, reps:10 } },
  { name:'HIIT', params:{ rounds:8, work:20, rest:10 } },
];

export default function ProtocolPicker({ value, onChange }:{ value?:any; onChange:(v:any)=>void }){
  return (
    <View style={{ borderWidth:1, borderColor:'#f0f0f0', borderRadius:10, padding:10 }}>
      <Text style={{ fontWeight:'700', marginBottom:6 }}>پروتکل تمرین</Text>
      <View style={{ flexDirection:'row', flexWrap:'wrap', gap:8 }}>
        {PRESETS.map(p=> (
          <TouchableOpacity key={p.name} onPress={()=> onChange(p)}>
            <Text style={{ paddingHorizontal:10, paddingVertical:6, borderRadius:100, backgroundColor: value?.name===p.name ? '#111':'#f2f2f2', color: value?.name===p.name ? '#fff':'#111' }}>{p.name}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity onPress={()=> onChange(null)}><Text style={{ paddingHorizontal:10, paddingVertical:6, borderRadius:100, backgroundColor:'#f2f2f2' }}>هیچ‌کدام</Text></TouchableOpacity>
      </View>
      {!!value && (
        <View style={{ marginTop:8, gap:6 }}>
          {Object.keys(value.params).map(k=> (
            <View key={k} style={{ flexDirection:'row', alignItems:'center', gap:6 }}>
              <Text style={{ width:90, opacity:.7 }}>{k}</Text>
              <TextInput keyboardType="numeric" value={String(value.params[k])} onChangeText={(v)=> onChange({ ...value, params: { ...value.params, [k]: Number(v)||0 } })}
                style={{ borderWidth:1, borderColor:'#eee', borderRadius:8, paddingHorizontal:8, height:36, width:100 }} />
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
