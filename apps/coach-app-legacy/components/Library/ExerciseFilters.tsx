
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';

export default function ExerciseFilters({ muscles=[], equipment=[], sports=[], value, onChange } : any){
  const [q, setQ] = useState(value?.search||'');
  const [level, setLevel] = useState(value?.level||'');
  const [kind, setKind] = useState(value?.kind||'');
  const [selMuscles, setSelMuscles] = useState<string[]>(value?.muscles||[]);
  const [selSports, setSelSports] = useState<string[]>(value?.sports||[]);

  const toggle = (arr:string[], set:any, v:string)=> set(arr.includes(v)? arr.filter(x=>x!==v): [...arr, v]);

  return (
    <View style={{ gap:8 }}>
      <TextInput placeholder="جستجو..." value={q} onChangeText={setQ} style={{ borderWidth:1, borderColor:'#eee', borderRadius:10, paddingHorizontal:10, height:42 }} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical:4 }}>
        {['beginner','intermediate','advanced'].map(l=> (
          <Text key={l} onPress={()=> setLevel(level===l? '':l)} style={{ marginRight:6, padding:8, borderWidth:1, borderColor:'#eee', borderRadius:100, backgroundColor: level===l? '#111':'#fff', color: level===l? '#fff':'#111' }}>{l}</Text>
        ))}
        {['WARMUP','MAIN','COOLDOWN'].map(k=> (
          <Text key={k} onPress={()=> setKind(kind===k? '':k)} style={{ marginRight:6, padding:8, borderWidth:1, borderColor:'#eee', borderRadius:100, backgroundColor: kind===k? '#111':'#fff', color: kind===k? '#fff':'#111' }}>{k}</Text>
        ))}
      </ScrollView>
      <Text style={{ fontWeight:'700' }}>عضلات</Text>
      <View style={{ flexDirection:'row', flexWrap:'wrap' }}>
        {muscles.map((m:any)=> (
          <Text key={m.code} onPress={()=> toggle(selMuscles, setSelMuscles, m.code)} style={{ margin:4, padding:6, borderWidth:1, borderColor:'#eee', borderRadius:100, backgroundColor: selMuscles.includes(m.code)? '#111':'#fff', color: selMuscles.includes(m.code)? '#fff':'#111' }}>{m.code}</Text>
        ))}
      </View>
      <Text style={{ fontWeight:'700' }}>رشته‌ها</Text>
      <View style={{ flexDirection:'row', flexWrap:'wrap' }}>
        {sports.map((s:any)=> (
          <Text key={s.id} onPress={()=> toggle(selSports, setSelSports, s.id)} style={{ margin:4, padding:6, borderWidth:1, borderColor:'#eee', borderRadius:100, backgroundColor: selSports.includes(s.id)? '#111':'#fff', color: selSports.includes(s.id)? '#fff':'#111' }}>{s.name}</Text>
        ))}
      </View>
      <TouchableOpacity onPress={()=> onChange && onChange({ search:q||undefined, level: level||undefined, kind: kind||undefined, muscles: selMuscles, sports: selSports })}>
        <Text style={{ padding:10, textAlign:'center', borderRadius:8, backgroundColor:'#111', color:'#fff' }}>اعمال فیلتر</Text>
      </TouchableOpacity>
    </View>
  );
}
