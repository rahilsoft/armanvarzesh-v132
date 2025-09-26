import React from 'react';
import { ScrollView, Text } from 'react-native';
import { useKpis, useWeekly } from '../../../../packages/data/analytics/hooks';
export default function CoachAnalyticsScreen(){
  const { data:kpis } = useKpis();
  const { data:weekly } = useWeekly();
  return (
    <ScrollView contentContainerStyle={{padding:16}}>
      <Text style={{fontWeight:'700'}}>تحلیل مربی</Text>
      {kpis?.map(k=> <Text key={k.id}>{k.label}: {k.value} {k.unit||''}</Text>)}
      {weekly?.points.map(p=> <Text key={p.t}>{new Date(p.t).toLocaleDateString('fa-IR')} — {p.v}</Text>)}
    </ScrollView>
  );
}
