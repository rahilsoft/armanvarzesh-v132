import React from 'react';
import { ScrollView, Text, TouchableOpacity } from 'react-native';
import { useAssessments } from '../../../../packages/data/assessments/hooks';
export default function AssessmentsScreen({ navigation }: any){
  const { data, loading, error } = useAssessments();
  if(loading) return <Text>...</Text>;
  if(error) return <Text>خطا</Text>;
  if(!data || data.length===0) return <Text>یافت نشد</Text>;
  return (
    <ScrollView contentContainerStyle={{padding:16}}>
      {data.map(a=> <TouchableOpacity key={a.id} onPress={()=> navigation.navigate('AssessmentFill', { id: a.id })}><Text style={{marginBottom:8}}>{a.title}</Text></TouchableOpacity>)}
    </ScrollView>
  );
}
