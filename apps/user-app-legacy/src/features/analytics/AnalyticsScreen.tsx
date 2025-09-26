import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useKpis, useWeekly } from '../../../../packages/data/analytics/hooks';
export default function AnalyticsScreen(){
  const { data:kpis, loading:lk } = useKpis();
  const { data:weekly, loading:lw } = useWeekly();
  return (
    <ScrollView contentContainerStyle={{padding:16}}>
      <Text style={{fontWeight:'700', fontSize:18}}>تحلیل‌ها</Text>
      {lk? <Text>در حال بارگذاری…</Text> : kpis?.map(k=> <Text key={k.id}>{k.label}: {k.value} {k.unit||''}</Text>)}
      {lw? <Text>...</Text> : weekly?.points.map(p=> <Text key={p.t}>{new Date(p.t).toLocaleDateString('fa-IR')} — {p.v}</Text>)}
    </ScrollView>
  );
}
