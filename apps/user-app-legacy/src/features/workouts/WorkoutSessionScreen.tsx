import React from 'react';
import { ScrollView, Text, Button } from 'react-native';
import { useWorkoutSession, useCompleteSession } from '../../../../packages/data/workouts/hooks';
export default function WorkoutSessionScreen({ route }: any){
  const id = String(route?.params?.id || 's-1');
  const { data, loading, error, reload } = useWorkoutSession(id);
  const { mutate: complete, loading: completing } = useCompleteSession();
  if(loading) return <Text>...</Text>;
  if(error) return <Text>خطا</Text>;
  if(!data) return <Text>یافت نشد</Text>;
  return (
    <ScrollView contentContainerStyle={{padding:16}}>
      {data.exercises.map(e=> <Text key={e.id}>{e.name} — {e.sets}×{e.reps}</Text>)}
      <Button title={completing? '...' : 'اتمام جلسه'} onPress={async()=>{ await complete(id); reload(); }} />
    </ScrollView>
  );
}
