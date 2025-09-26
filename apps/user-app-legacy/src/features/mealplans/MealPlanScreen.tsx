import React from 'react';
import { ScrollView, Text } from 'react-native';
import { useMeal } from '../../../../packages/data/nutrition/hooks';
export default function MealPlanScreen({ route }:any){
  const id = route?.params?.id || 'm1';
  const { data, loading } = useMeal(id);
  if(loading) return <Text>...</Text>;
  return (
    <ScrollView contentContainerStyle={{padding:16}}>
      <Text>{data?.title}</Text>
      {(data?.items||[]).map((it:any)=> <Text key={it.foodId}>{it.foodId} — {it.amount}</Text>)}
    </ScrollView>
  );
}
