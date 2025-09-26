
import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { gql, useLazyQuery, useMutation } from '@apollo/client';

const SEARCH = gql`query($input:SearchExerciseInput!){ searchExercises(input:$input){ id title primaryMuscles } }`;
const CREATE = gql`mutation($input:ComplexBlockInput!){ createComplexBlock(input:$input) }`;

export default function QuickBlockScreen({ route, navigation }: any){
  const { dayId } = route.params||{};
  const [q, setQ] = useState('');
  const [muscle, setMuscle] = useState('');
  const [sel, setSel] = useState<Record<string, boolean>>({});
  const [type, setType] = useState<'SINGLE'|'SUPERSET'|'TRISET'|'CIRCUIT'>('SINGLE');
  const [section, setSection] = useState<'WARMUP'|'MAIN'|'COOLDOWN'>('MAIN');
  const [rounds, setRounds] = useState<number>(3);
  const [rest, setRest] = useState<number>(20);
  const [protocol, setProtocol] = useState<string>('');
  const [params, setParams] = useState<string>('{}');

  const [run, { data }] = useLazyQuery(SEARCH);
  const [create] = useMutation(CREATE);

  useEffect(()=>{ run({ variables: { input: { q, muscles: muscle? [muscle]: undefined } } }); }, []);
  const list = data?.searchExercises||[];
  const ids = useMemo(()=> Object.keys(sel).filter(k=> sel[k]), [sel]);

  const go = async ()=>{
    await create({ variables: { input: { dayId, section, type, exerciseIds: ids, rounds, restBetweenItemsSec: rest, protocol, params } } });
    navigation.goBack();
  };

  return (
    <View style={{ flex:1, padding:12 }}>
      <Text style={{ fontWeight:'800', fontSize:18 }}>ساخت سریع بلوک</Text>
      <View style={{ flexDirection:'row', gap:8, marginTop:8 }}>
        <TextInput value={q} onChangeText={setQ} placeholder="جستجو…" style={{ flex:1, borderWidth:1, borderColor:'#eee', borderRadius:10, paddingHorizontal:10 }} />
        <TextInput value={muscle} onChangeText={setMuscle} placeholder="muscle code" style={{ width:120, borderWidth:1, borderColor:'#eee', borderRadius:10, paddingHorizontal:10 }} />
        <TouchableOpacity onPress={()=> run({ variables: { input: { q, muscles: muscle? [muscle]: undefined } } })}><Text style={{ padding:10 }}>جستجو</Text></TouchableOpacity>
      </View>
      <ScrollView style={{ flex:1, marginTop:8 }}>
        {list.map((it:any)=> (
          <TouchableOpacity key={it.id} onPress={()=> setSel(prev=> ({ ...prev, [it.id]: !prev[it.id] }))} style={{ padding:8, borderWidth:1, borderColor:'#eee', borderRadius:10, marginBottom:6, backgroundColor: sel[it.id]? '#111':'#fff' }}>
            <Text style={{ color: sel[it.id]? '#fff':'#111', fontWeight:'700' }}>{it.title}</Text>
            <Text style={{ color: sel[it.id]? '#fff':'#777' }}>{(it.primaryMuscles||[]).join(', ')}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={{ height:8 }} />
      <View style={{ flexDirection:'row', flexWrap:'wrap', gap:6 }}>
        {(['WARMUP','MAIN','COOLDOWN'] as const).map(s=> (
          <Text key={s} onPress={()=> setSection(s)} style={{ padding:8, borderWidth:1, borderColor:'#eee', borderRadius:100, backgroundColor: section===s? '#111':'#fff', color: section===s? '#fff':'#111' }}>{s}</Text>
        ))}
      </View>
      <View style={{ height:6 }} />
      <View style={{ flexDirection:'row', flexWrap:'wrap', gap:6 }}>
        {(['SINGLE','SUPERSET','TRISET','CIRCUIT'] as const).map(t=> (
          <Text key={t} onPress={()=> setType(t)} style={{ padding:8, borderWidth:1, borderColor:'#eee', borderRadius:100, backgroundColor: type===t? '#111':'#fff', color: type===t? '#fff':'#111' }}>{t}</Text>
        ))}
      </View>
      {type!=='SINGLE' && (
        <View style={{ flexDirection:'row', gap:6, marginTop:6 }}>
          <TextInput keyboardType="numeric" value={String(rounds)} onChangeText={v=> setRounds(parseInt(v||'0'))} placeholder="rounds" style={{ borderWidth:1, borderColor:'#eee', borderRadius:10, paddingHorizontal:10, minWidth:90 }} />
          <TextInput keyboardType="numeric" value={String(rest)} onChangeText={v=> setRest(parseInt(v||'0'))} placeholder="restBetween" style={{ borderWidth:1, borderColor:'#eee', borderRadius:10, paddingHorizontal:10, minWidth:120 }} />
        </View>
      )}
      <View style={{ flexDirection:'row', gap:6, marginTop:6 }}>
        <TextInput value={protocol} onChangeText={setProtocol} placeholder="protocol (اختیاری)" style={{ flex:1, borderWidth:1, borderColor:'#eee', borderRadius:10, paddingHorizontal:10 }} />
        <TextInput value={params} onChangeText={setParams} placeholder='params JSON' style={{ flex:1, borderWidth:1, borderColor:'#eee', borderRadius:10, paddingHorizontal:10 }} />
      </View>
      <View style={{ height:8 }} />
      <TouchableOpacity onPress={go}><Text style={{ textAlign:'center', padding:12, backgroundColor:'#111', color:'#fff', borderRadius:10 }}>ساخت بلوک</Text></TouchableOpacity>
    </View>
  );
}
