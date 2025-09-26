
import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Button, Alert } from 'react-native';
import { useMutation, useQuery } from '@apollo/client';
import { PLAN_BY_ID, UPSERT_PLAN, PUBLISH_PLAN, ASSIGN_PLAN } from '@graphql/queries/plans.queries';
import DayEditor from '@components/Plans/DayEditor';
import BlockEditor from '@components/Plans/BlockEditor';
import ProtocolTimer from '@components/Plans/ProtocolTimer';
import TemplateWizardScreen from './TemplateWizardScreen';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { gql, useMutation } from '@apollo/client';

function newDay(order:number){ return { id: undefined, order, title:'', items: [] }; }
function newItem(ex:any){ return { id: undefined, order: 0, exercise: ex, note: '', sets: [{ reps:10, weight:0, rest:60, tempo:'2-1-2' }] }; }


const UPDATE_META = gql`mutation($id:String!, $section:String, $type:String, $rounds:Int, $rest:Int){ updateBlockMeta(blockId:$id, section:$section, type:$type, rounds:$rounds, restBetweenItemsSec:$rest) }`;
const APPLY = gql`mutation($id:String!, $p:String!, $params:String){ applyProtocol(blockId:$id, protocol:$p, params:$params) }`;

const UPLOAD_VOICE = gql`mutation($data:String!,$ext:String!){ uploadVoice(data:$data, ext:$ext){ url } }`;

export default function PlanEditorScreen({ route, navigation } : any){
  
const UPDATE_META = gql`mutation($id:String!, $section:String, $type:String, $rounds:Int, $rest:Int){ updateBlockMeta(blockId:$id, section:$section, type:$type, rounds:$rounds, restBetweenItemsSec:$rest) }`;
const APPLY = gql`mutation($id:String!, $p:String!, $params:String){ applyProtocol(blockId:$id, protocol:$p, params:$params) }`;

const id = route.params?.id as string | undefined;
  
const UPDATE_META = gql`mutation($id:String!, $section:String, $type:String, $rounds:Int, $rest:Int){ updateBlockMeta(blockId:$id, section:$section, type:$type, rounds:$rounds, restBetweenItemsSec:$rest) }`;
const APPLY = gql`mutation($id:String!, $p:String!, $params:String){ applyProtocol(blockId:$id, protocol:$p, params:$params) }`;

const { data, loading, refetch } = useQuery(PLAN_BY_ID, { variables: { id }, skip: !id });
  
const UPDATE_META = gql`mutation($id:String!, $section:String, $type:String, $rounds:Int, $rest:Int){ updateBlockMeta(blockId:$id, section:$section, type:$type, rounds:$rounds, restBetweenItemsSec:$rest) }`;
const APPLY = gql`mutation($id:String!, $p:String!, $params:String){ applyProtocol(blockId:$id, protocol:$p, params:$params) }`;

const [upsert, { loading: saving }] = useMutation(UPSERT_PLAN);
  
const UPDATE_META = gql`mutation($id:String!, $section:String, $type:String, $rounds:Int, $rest:Int){ updateBlockMeta(blockId:$id, section:$section, type:$type, rounds:$rounds, restBetweenItemsSec:$rest) }`;
const APPLY = gql`mutation($id:String!, $p:String!, $params:String){ applyProtocol(blockId:$id, protocol:$p, params:$params) }`;

const [publish, { loading: publishing }] = useMutation(PUBLISH_PLAN);
  
const UPDATE_META = gql`mutation($id:String!, $section:String, $type:String, $rounds:Int, $rest:Int){ updateBlockMeta(blockId:$id, section:$section, type:$type, rounds:$rounds, restBetweenItemsSec:$rest) }`;
const APPLY = gql`mutation($id:String!, $p:String!, $params:String){ applyProtocol(blockId:$id, protocol:$p, params:$params) }`;

const [assign, { loading: assigning }] = useMutation(ASSIGN_PLAN);

  
const UPDATE_META = gql`mutation($id:String!, $section:String, $type:String, $rounds:Int, $rest:Int){ updateBlockMeta(blockId:$id, section:$section, type:$type, rounds:$rounds, restBetweenItemsSec:$rest) }`;
const APPLY = gql`mutation($id:String!, $p:String!, $params:String){ applyProtocol(blockId:$id, protocol:$p, params:$params) }`;

const [title, setTitle] = useState('');
  
const UPDATE_META = gql`mutation($id:String!, $section:String, $type:String, $rounds:Int, $rest:Int){ updateBlockMeta(blockId:$id, section:$section, type:$type, rounds:$rounds, restBetweenItemsSec:$rest) }`;
const APPLY = gql`mutation($id:String!, $p:String!, $params:String){ applyProtocol(blockId:$id, protocol:$p, params:$params) }`;

const [description, setDescription] = useState('');
  
const UPDATE_META = gql`mutation($id:String!, $section:String, $type:String, $rounds:Int, $rest:Int){ updateBlockMeta(blockId:$id, section:$section, type:$type, rounds:$rounds, restBetweenItemsSec:$rest) }`;
const APPLY = gql`mutation($id:String!, $p:String!, $params:String){ applyProtocol(blockId:$id, protocol:$p, params:$params) }`;

const [days, setDays] = useState<any[]>([]);

  useEffect(()=>{
    if (data?.plan){
      setTitle(data.plan.title||''); setDescription(data.plan.description||'');
      
const UPDATE_META = gql`mutation($id:String!, $section:String, $type:String, $rounds:Int, $rest:Int){ updateBlockMeta(blockId:$id, section:$section, type:$type, rounds:$rounds, restBetweenItemsSec:$rest) }`;
const APPLY = gql`mutation($id:String!, $p:String!, $params:String){ applyProtocol(blockId:$id, protocol:$p, params:$params) }`;

const d = (data.plan.days||[]).map((x:any)=> ({ ...x, items: (x.items||[]).map((it:any)=> ({ ...it })) }));
      setDays(d);
    }else if (!id){
      setTitle('برنامه جدید'); setDescription(''); setDays([ newDay(0) ]);
    }
  }, [data?.plan, id]);

  
const UPDATE_META = gql`mutation($id:String!, $section:String, $type:String, $rounds:Int, $rest:Int){ updateBlockMeta(blockId:$id, section:$section, type:$type, rounds:$rounds, restBetweenItemsSec:$rest) }`;
const APPLY = gql`mutation($id:String!, $p:String!, $params:String){ applyProtocol(blockId:$id, protocol:$p, params:$params) }`;

const addDay = ()=> setDays(prev=> [...prev, newDay(prev.length)]);
  
const UPDATE_META = gql`mutation($id:String!, $section:String, $type:String, $rounds:Int, $rest:Int){ updateBlockMeta(blockId:$id, section:$section, type:$type, rounds:$rounds, restBetweenItemsSec:$rest) }`;
const APPLY = gql`mutation($id:String!, $p:String!, $params:String){ applyProtocol(blockId:$id, protocol:$p, params:$params) }`;

const removeDay = (i:number)=> setDays(prev=> prev.filter((_,idx)=> idx!==i).map((d,idx)=> ({ ...d, order: idx })));
  
const UPDATE_META = gql`mutation($id:String!, $section:String, $type:String, $rounds:Int, $rest:Int){ updateBlockMeta(blockId:$id, section:$section, type:$type, rounds:$rounds, restBetweenItemsSec:$rest) }`;
const APPLY = gql`mutation($id:String!, $p:String!, $params:String){ applyProtocol(blockId:$id, protocol:$p, params:$params) }`;

const updateDay = (i:number, patch:any)=> setDays(prev=> prev.map((d,idx)=> idx===i ? { ...d, ...patch } : d));

  
const UPDATE_META = gql`mutation($id:String!, $section:String, $type:String, $rounds:Int, $rest:Int){ updateBlockMeta(blockId:$id, section:$section, type:$type, rounds:$rounds, restBetweenItemsSec:$rest) }`;
const APPLY = gql`mutation($id:String!, $p:String!, $params:String){ applyProtocol(blockId:$id, protocol:$p, params:$params) }`;

const openLibrary = (dayIndex:number)=>{
    navigation.navigate('ExerciseLibrary', {
      onSelect: (ex:any)=> {
        setDays(prev=> prev.map((d, idx)=> {
          if (idx!==dayIndex) return d;
          
const UPDATE_META = gql`mutation($id:String!, $section:String, $type:String, $rounds:Int, $rest:Int){ updateBlockMeta(blockId:$id, section:$section, type:$type, rounds:$rounds, restBetweenItemsSec:$rest) }`;
const APPLY = gql`mutation($id:String!, $p:String!, $params:String){ applyProtocol(blockId:$id, protocol:$p, params:$params) }`;

const items = [...(d.items||[])];
          items.push(newItem(ex));
          return { ...d, items };
        }));
      }
    });
  };

  
const UPDATE_META = gql`mutation($id:String!, $section:String, $type:String, $rounds:Int, $rest:Int){ updateBlockMeta(blockId:$id, section:$section, type:$type, rounds:$rounds, restBetweenItemsSec:$rest) }`;
const APPLY = gql`mutation($id:String!, $p:String!, $params:String){ applyProtocol(blockId:$id, protocol:$p, params:$params) }`;

const onSave = async ()=>{
    
const UPDATE_META = gql`mutation($id:String!, $section:String, $type:String, $rounds:Int, $rest:Int){ updateBlockMeta(blockId:$id, section:$section, type:$type, rounds:$rounds, restBetweenItemsSec:$rest) }`;
const APPLY = gql`mutation($id:String!, $p:String!, $params:String){ applyProtocol(blockId:$id, protocol:$p, params:$params) }`;

const input = {
      id,
      title, description,
      days: days.map((d, di)=> ({
        id: d.id, order: di, title: d.title,
        items: (d.items||[]).map((it:any, ii:number)=> ({
          id: it.id, order: ii, note: it.note,
          exerciseId: it.exercise?.id,
          sets: (it.sets||[]).map((s:any)=> ({ reps: s.reps, weight: s.weight, rest: s.rest, tempo: s.tempo }))
        }))
      }))
    };
    
const UPDATE_META = gql`mutation($id:String!, $section:String, $type:String, $rounds:Int, $rest:Int){ updateBlockMeta(blockId:$id, section:$section, type:$type, rounds:$rounds, restBetweenItemsSec:$rest) }`;
const APPLY = gql`mutation($id:String!, $p:String!, $params:String){ applyProtocol(blockId:$id, protocol:$p, params:$params) }`;

const { data } = await upsert({ variables: { input } });
    if (data?.upsertPlan?.id){
      Alert.alert('ذخیره شد', '', [{ text:'باشه', onPress:()=> navigation.setParams({ id: data.upsertPlan.id }) }]);
    }
  };

  
const UPDATE_META = gql`mutation($id:String!, $section:String, $type:String, $rounds:Int, $rest:Int){ updateBlockMeta(blockId:$id, section:$section, type:$type, rounds:$rounds, restBetweenItemsSec:$rest) }`;
const APPLY = gql`mutation($id:String!, $p:String!, $params:String){ applyProtocol(blockId:$id, protocol:$p, params:$params) }`;

const [assignClientId, setAssignClientId] = useState('');
  
const UPDATE_META = gql`mutation($id:String!, $section:String, $type:String, $rounds:Int, $rest:Int){ updateBlockMeta(blockId:$id, section:$section, type:$type, rounds:$rounds, restBetweenItemsSec:$rest) }`;
const APPLY = gql`mutation($id:String!, $p:String!, $params:String){ applyProtocol(blockId:$id, protocol:$p, params:$params) }`;

const [sessionsPerWeek, setSessionsPerWeek] = useState(4);
  
const UPDATE_META = gql`mutation($id:String!, $section:String, $type:String, $rounds:Int, $rest:Int){ updateBlockMeta(blockId:$id, section:$section, type:$type, rounds:$rounds, restBetweenItemsSec:$rest) }`;
const APPLY = gql`mutation($id:String!, $p:String!, $params:String){ applyProtocol(blockId:$id, protocol:$p, params:$params) }`;

const [restDays, setRestDays] = useState<string[]>(['Fri']);
  
const UPDATE_META = gql`mutation($id:String!, $section:String, $type:String, $rounds:Int, $rest:Int){ updateBlockMeta(blockId:$id, section:$section, type:$type, rounds:$rounds, restBetweenItemsSec:$rest) }`;
const APPLY = gql`mutation($id:String!, $p:String!, $params:String){ applyProtocol(blockId:$id, protocol:$p, params:$params) }`;

const [durationDays, setDurationDays] = useState(30);
  
const UPDATE_META = gql`mutation($id:String!, $section:String, $type:String, $rounds:Int, $rest:Int){ updateBlockMeta(blockId:$id, section:$section, type:$type, rounds:$rounds, restBetweenItemsSec:$rest) }`;
const APPLY = gql`mutation($id:String!, $p:String!, $params:String){ applyProtocol(blockId:$id, protocol:$p, params:$params) }`;

const [startDate, setStartDate] = useState('2025-09-01');

  return (
    <View style={{ flex:1 }}>
      <ScrollView contentContainerStyle={{ padding:12 }}>
        <View style={{ gap:8 }}>
          <TextInput placeholder="عنوان برنامه" value={title} onChangeText={setTitle}
            style={{ borderWidth:1, borderColor:'#eee', borderRadius:10, paddingHorizontal:12, height:42 }} />
          <TextInput placeholder="توضیحات" value={description} onChangeText={setDescription} multiline numberOfLines={3}
            style={{ borderWidth:1, borderColor:'#eee', borderRadius:10, paddingHorizontal:12, minHeight:80, textAlignVertical:'top' }} />
        </View>
        <View style={{ height:12 }} />
        {(days||[]).map((d:any, i:number)=> (
          <DayEditor key={i} day={d} onChange={(patch)=> updateDay(i, patch)} onAddExercise={()=> openLibrary(i)} onRemoveDay={()=> removeDay(i)} />
        ))}
        <TouchableOpacity onPress={addDay}><Text style={{ color:'#2a6cfb' }}>از تمپلیت</Text></TouchableOpacity>
        <View style={{ height:8 }} />
        <Button title="افزودن حرکت با نقشهٔ بدن" onPress={()=> navigation.navigate('BodyAtlas', { onSelect: (m:string)=> navigation.navigate('ExerciseLibrary', { onSelect: (ex:any)=>{
          setDays(prev=>{
            
const UPDATE_META = gql`mutation($id:String!, $section:String, $type:String, $rounds:Int, $rest:Int){ updateBlockMeta(blockId:$id, section:$section, type:$type, rounds:$rounds, restBetweenItemsSec:$rest) }`;
const APPLY = gql`mutation($id:String!, $p:String!, $params:String){ applyProtocol(blockId:$id, protocol:$p, params:$params) }`;

const d = prev[0] || { id: undefined, order: 0, title:'', items: [] };
            
const UPDATE_META = gql`mutation($id:String!, $section:String, $type:String, $rounds:Int, $rest:Int){ updateBlockMeta(blockId:$id, section:$section, type:$type, rounds:$rounds, restBetweenItemsSec:$rest) }`;
const APPLY = gql`mutation($id:String!, $p:String!, $params:String){ applyProtocol(blockId:$id, protocol:$p, params:$params) }`;

const items = [...(d.items||[])];
            items.push({ id: undefined, order: items.length, exercise: ex, note: '', sets: [{ reps:10, weight:0, rest:60, tempo:'2-1-2' }] });
            
const UPDATE_META = gql`mutation($id:String!, $section:String, $type:String, $rounds:Int, $rest:Int){ updateBlockMeta(blockId:$id, section:$section, type:$type, rounds:$rounds, restBetweenItemsSec:$rest) }`;
const APPLY = gql`mutation($id:String!, $p:String!, $params:String){ applyProtocol(blockId:$id, protocol:$p, params:$params) }`;

const next = [...prev]; next[0] = d.id ? { ...d, items } : { ...d, items };
            return next;
          });
        }, muscle: m }) })} />


        <View style={{ height:16 }} />
        <Button title={saving?'...':'ذخیره'} onPress={onSave} />
        <View style={{ height:6 }} />
        <Button title={publishing?'...':'انتشار'} onPress={async()=>{
          if (!id) { Alert.alert('ابتدا ذخیره کنید'); return; }
          await publish({ variables: { id } }); Alert.alert('منتشر شد'); refetch();
        }} />
        <View style={{ height:16 }} />
        <Text style={{ fontWeight:'700', marginBottom:8 }}>اختصاص برنامه به مشتری</Text>
        <TextInput placeholder="Client ID" value={assignClientId} onChangeText={setAssignClientId}
          style={{ borderWidth:1, borderColor:'#eee', borderRadius:10, paddingHorizontal:12, height:42, marginBottom:6 }} />
        <TextInput placeholder="تاریخ شروع (YYYY-MM-DD)" value={startDate} onChangeText={setStartDate}
          style={{ borderWidth:1, borderColor:'#eee', borderRadius:10, paddingHorizontal:12, height:42, marginBottom:6 }} />
        <TextInput placeholder="جلسات در هفته (عدد)" value={String(sessionsPerWeek)} onChangeText={(v)=> setSessionsPerWeek(Number(v)||0)} style={{ borderWidth:1, borderColor:'#eee', borderRadius:10, paddingHorizontal:12, height:42, marginBottom:6 }} />
        <TextInput placeholder="روزهای استراحت (CSV مثل Fri,Sat)" value={restDays.join(',')} onChangeText={(v)=> setRestDays(v.split(',').map(x=> x.trim()))} style={{ borderWidth:1, borderColor:'#eee', borderRadius:10, paddingHorizontal:12, height:42, marginBottom:6 }} />
        <TextInput placeholder="مدت برنامه (روز)" value={String(durationDays)} onChangeText={(v)=> setDurationDays(Number(v)||30)} style={{ borderWidth:1, borderColor:'#eee', borderRadius:10, paddingHorizontal:12, height:42, marginBottom:6 }} />
        <Button title={assigning?'...':'اختصاص'} onPress={async()=>{
          if (!id) { Alert.alert('ابتدا ذخیره کنید'); return; }
          if (!assignClientId) { Alert.alert('Client ID لازم است'); return; }
          await assign({ variables: { planId: id, clientId: assignClientId, startDate, sessionsPerWeek, restDays, durationDays } });
          Alert.alert('اختصاص یافت');
        }} />
      </ScrollView>
    </View>
  );
}

function useServerActions(){
  const [upd] = useMutation(UPDATE_META);
  const [apply] = useMutation(APPLY);
  return { upd, apply };
}

function usePlanMutations(){
  const [updateMeta] = useMutation(UPDATE_META);
  const [apply] = useMutation(APPLY);
  const [reorder] = useMutation(REORDER);
  const [dup] = useMutation(DUPBLOCK);
  return { updateMeta, apply, reorder, dup };
}

function onChangeBlock(day:any, dayIndex:number, blockIndex:number, patch:any){
  try{
    const { updateMeta, apply, reorder, dup } = usePlanMutations();
    const b = (day.blocks||[])[blockIndex];
    if (patch._applyProtocol){
      apply({ variables: { id: b.id, p: String(patch._applyProtocol||'').toUpperCase(), params: JSON.stringify(patch.params||{}) } });
      return;
    }
    if (patch._action==='DUPLICATE'){
      dup({ variables: { id: b.id } });
      return;
    }
    if (patch._action==='MOVE_UP' || patch._action==='MOVE_DOWN'){
      const arr = (day.blocks||[]).slice().sort((x:any,y:any)=> x.order-y.order);
      const idx = arr.findIndex((x:any)=> x.id===b.id);
      const ni = patch._action==='MOVE_UP'? Math.max(0, idx-1) : Math.min(arr.length-1, idx+1);
      if (ni===idx) return;
      const [m] = arr.splice(idx,1); arr.splice(ni,0,m);
      const ids = arr.map((x:any)=> x.id);
      reorder({ variables: { dayId: day.id, ids } });
      return;
    }
    const vars:any = { id: b.id };
    if ('section' in patch) vars.section = patch.section;
    if ('type' in patch) vars.type = patch.type;
    if ('rounds' in patch) vars.rounds = patch.rounds;
    if ('restBetweenItemsSec' in patch) vars.rest = patch.restBetweenItemsSec;
    if (Object.keys(vars).length>1) updateMeta({ variables: vars });
  }catch(e){}
}
