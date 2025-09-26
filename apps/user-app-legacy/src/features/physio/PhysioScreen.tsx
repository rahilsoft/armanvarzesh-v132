import React from 'react';
import { ScrollView, Text } from 'react-native';
import { usePrescriptions } from '../../../../packages/data/physio/hooks';
export default function PhysioScreen(){
  const { data, loading, error } = usePrescriptions();
  if(loading) return <Text>...</Text>;
  if(error) return <Text>خطا</Text>;
  if(!data || data.length===0) return <Text>خالی</Text>;
  return (
    <ScrollView contentContainerStyle={{padding:16}}>
      {data.map(p=> <Text key={p.id}>{p.area} — درد {p.painLevel}</Text>)}
    </ScrollView>
  );
}
