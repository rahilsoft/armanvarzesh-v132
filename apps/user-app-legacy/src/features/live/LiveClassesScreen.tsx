import React from 'react';
import { ScrollView, Text } from 'react-native';
import { useLiveRooms } from '../../../../packages/data/live/hooks';
export default function LiveClassesScreen(){
  const { data, loading, error } = useLiveRooms();
  if(loading) return <Text>...</Text>;
  if(error) return <Text>خطا</Text>;
  return (
    <ScrollView contentContainerStyle={{padding:16}}>
      {(data||[]).map(r=> <Text key={r.id}>{r.title} — {r.status}</Text>)}
    </ScrollView>
  );
}
