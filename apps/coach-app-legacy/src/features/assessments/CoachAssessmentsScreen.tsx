import React from 'react';
import { ScrollView, Text } from 'react-native';
import { useSubmissions } from '../../../../packages/data/assessments/hooks';
export default function CoachAssessmentsScreen(){
  const { data, loading } = useSubmissions();
  if(loading) return <Text>...</Text>;
  return (
    <ScrollView contentContainerStyle={{padding:16}}>
      {(data||[]).map(s=> <Text key={s.id}>{s.id}</Text>)}
    </ScrollView>
  );
}
