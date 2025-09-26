import React from 'react';
import { ScrollView, Text } from 'react-native';
import { useSchedule } from '../../../../packages/data/schedule/hooks';
export default function ScheduleScreen(){
  const { data, loading } = useSchedule();
  if(loading) return <Text>...</Text>;
  return (
    <ScrollView contentContainerStyle={{padding:16}}>
      {(data||[]).map(s=> <Text key={s.id}>{new Date(s.date).toLocaleString()} — {s.workoutId} — {s.status}</Text>)}
    </ScrollView>
  );
}
