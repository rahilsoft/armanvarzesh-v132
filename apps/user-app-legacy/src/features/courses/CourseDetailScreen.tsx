import React from 'react';
import { ScrollView, Text, Button } from 'react-native';
import { useCourse, useEnroll } from '../../../../packages/data/courses/hooks';
export default function CourseDetailScreen({ route }: any){
  const id = String(route?.params?.id || 'c-1');
  const { data, loading, error } = useCourse(id);
  const { mutate: enroll, loading: enrolling } = useEnroll();
  if(loading) return <Text>...</Text>;
  if(error) return <Text>خطا</Text>;
  if(!data) return <Text>یافت نشد</Text>;
  return (
    <ScrollView contentContainerStyle={{padding:16}}>
      <Text style={{fontWeight:'700'}}>{data.title}</Text>
      <Text>{data.coach} — {data.level}</Text>
      {data.lessons.map(l=> <Text key={l.id}>{l.title} — {l.durMin} دقیقه</Text>)}
      <Button title={enrolling? '...' : 'ثبت‌نام'} onPress={()=> enroll(id)} />
    </ScrollView>
  );
}
