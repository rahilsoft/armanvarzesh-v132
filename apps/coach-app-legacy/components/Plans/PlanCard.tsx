
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function PlanCard({ plan, onPress, onMore }:{ plan:any; onPress:()=>void; onMore?:()=>void }){
  return (
    <TouchableOpacity onPress={onPress} style={s.card}>
      <View style={{flex:1}}>
        <Text style={s.title} numberOfLines={1}>{plan.title}</Text>
        {!!plan.description && <Text style={s.desc} numberOfLines={2}>{plan.description}</Text>}
        <View style={{flexDirection:'row', gap:8, marginTop:8, alignItems:'center'}}>
          <Badge text={plan.status||'DRAFT'} tone={plan.status==='PUBLISHED'?'green':'gray'} />
          <Text style={s.meta}>v{plan.version||1}</Text>
          {!!plan.updatedAt && <Text style={s.meta}>{new Date(plan.updatedAt).toLocaleDateString()}</Text>}
          {!!plan.assignedCount && <Text style={s.meta}>👥 {plan.assignedCount}</Text>}
        </View>
      </View>
      {!!onMore && <TouchableOpacity onPress={onMore}><Text style={{padding:8}}>⋯</Text></TouchableOpacity>}
    </TouchableOpacity>
  );
}

function Badge({ text, tone='gray' }:{ text:string; tone?:'gray'|'green'|'blue'|'red' }){
  const bg = tone==='green' ? '#e7f7ed' : tone==='blue' ? '#e7f0ff' : tone==='red' ? '#ffecef' : '#f4f4f6';
  const fg = tone==='green' ? '#1f8f4f' : tone==='blue' ? '#2a6cfb' : tone==='red' ? '#c22639' : '#444';
  return <View style={{ backgroundColor: bg, borderRadius:100, paddingHorizontal:8, paddingVertical:4 }}><Text style={{ color: fg }}>{text}</Text></View>;
}

const s = StyleSheet.create({
  card:{ borderWidth:1, borderColor:'#eee', borderRadius:12, padding:12, gap:6, flexDirection:'row' },
  title:{ fontSize:16, fontWeight:'700' },
  desc:{ fontSize:13, color:'#555' },
  meta:{ fontSize:12, color:'#777' }
});
