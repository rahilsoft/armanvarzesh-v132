import React from 'react';
import { ScrollView, Text } from 'react-native';
import { useWorkoutPlan } from '../../../../packages/data/workouts/hooks';
export default function AssignWorkoutScreen(){
  const { data, loading, error } = useWorkoutPlan();
  if(loading) return <Text>...</Text>;
  if(error) return <Text>Error</Text>;
  return (
    <ScrollView contentContainerStyle={{padding:16}}>
      <Text style={{fontWeight:'700'}}>اختصاص تمرین (نمایشی)</Text>
      {data?.sessions.map(s=> <Text key={s.id}>{s.id} — {new Date(s.date).toLocaleDateString('fa-IR')}</Text>)}
    </ScrollView>
  );
}
