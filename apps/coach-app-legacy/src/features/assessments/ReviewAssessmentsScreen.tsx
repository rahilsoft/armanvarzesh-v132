import React from 'react';
import { ScrollView, Text } from 'react-native';
import { useAssessments } from '../../../../packages/data/assessments/hooks';
export default function ReviewAssessmentsScreen(){
  const { data, loading, error } = useAssessments();
  if(loading) return <Text>...</Text>;
  if(error) return <Text>Error</Text>;
  return (
    <ScrollView contentContainerStyle={{padding:16}}>
      {data?.map(a=> <Text key={a.id}>{a.title}</Text>)}
    </ScrollView>
  );
}
