import React from 'react';
import { ScrollView, Text } from 'react-native';
import { useCoaches } from '../../../../packages/data/coaches/hooks';
export default function CoachRosterScreen(){
  const { data, loading } = useCoaches();
  return (
    <ScrollView contentContainerStyle={{padding:16}}>
      <Text>فهرست مربیان (نمایشی)</Text>
      {loading? <Text>...</Text> : data?.map(c=> <Text key={c.id}>{c.name}</Text>)}
    </ScrollView>
  );
}
