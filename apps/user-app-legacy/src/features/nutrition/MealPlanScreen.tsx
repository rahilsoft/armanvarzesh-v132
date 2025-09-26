import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { usePlan } from '../../../../packages/data/nutrition/hooks';
export default function MealPlanScreen(){
  const { data, loading, error } = usePlan();
  if(loading) return <Text>در حال بارگذاری…</Text>;
  if(error) return <Text>خطا</Text>;
  if(!data) return <Text>برنامه‌ای نیست</Text>;
  return (
    <ScrollView contentContainerStyle={{padding:16}}>
      <Text style={{fontWeight:'700'}}>{data.title}</Text>
      <Text>هدف پروتئین: {data.dailyProteinTarget} — هدف کالری: {data.dailyCalorieTarget}</Text>
      {data.meals.map(m=> <Text key={m.id}>{m.name} — {m.calories} kcal — {m.protein} g</Text>)}
    </ScrollView>
  );
}
