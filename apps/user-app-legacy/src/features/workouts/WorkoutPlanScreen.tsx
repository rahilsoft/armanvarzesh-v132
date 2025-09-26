import React from 'react';
import { ScrollView, Text, TouchableOpacity } from 'react-native';
import { useWorkoutPlan } from '../../../../packages/data/workouts/hooks';
export default function WorkoutPlanScreen({ navigation }: any){
  const { data, loading, error } = useWorkoutPlan();
  if(loading) return <Text>...</Text>;
  if(error) return <Text>خطا</Text>;
  if(!data) return <Text>برنامه‌ای نیست</Text>;
  return (
    <ScrollView contentContainerStyle={{padding:16}}>
      {data.sessions.map(s=> (
        <TouchableOpacity key={s.id} onPress={()=> navigation.navigate('WorkoutSession', { id: s.id })}>
          <Text style={{marginBottom:8}}>{new Date(s.date).toLocaleDateString('fa-IR')} — {s.status}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
