import React from 'react';
import { ScrollView, Text, TouchableOpacity } from 'react-native';
import { useCourses } from '../../../../packages/data/courses/hooks';
export default function CoursesScreen({ navigation }: any){
  const { data, loading, error } = useCourses();
  if(loading) return <Text>...</Text>;
  if(error) return <Text>خطا</Text>;
  return (
    <ScrollView contentContainerStyle={{padding:16}}>
      {data?.map(c=> (
        <TouchableOpacity key={c.id} onPress={()=> navigation.navigate('CourseDetail', { id: c.id })}>
          <Text style={{marginBottom:8}}>{c.title} — {c.level}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
