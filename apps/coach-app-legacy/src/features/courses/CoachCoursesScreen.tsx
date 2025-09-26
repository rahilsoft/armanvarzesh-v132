import React from 'react';
import { ScrollView, Text } from 'react-native';
import { useCourses } from '../../../../packages/data/courses/hooks';
export default function CoachCoursesScreen(){
  const { data, loading, error } = useCourses();
  if(loading) return <Text>...</Text>;
  if(error) return <Text>Error</Text>;
  return (
    <ScrollView contentContainerStyle={{padding:16}}>
      {data?.map(c=> <Text key={c.id}>{c.title} — {c.level}</Text>)}
    </ScrollView>
  );
}
