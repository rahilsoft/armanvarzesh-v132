import React, { useState } from 'react';
import { ScrollView, Text, TextInput, Button } from 'react-native';
import { useAssessment, useSubmitAssessment } from '../../../../packages/data/assessments/hooks';
export default function AssessmentFillScreen({ route }: any){
  const id = String(route?.params?.id || 'a1');
  const { data, loading, error } = useAssessment(id);
  const { mutate: submit, loading: submitting } = useSubmitAssessment();
  const [answers,setAnswers] = useState<Record<string, any>>({});
  if(loading) return <Text>...</Text>;
  if(error) return <Text>خطا</Text>;
  if(!data) return <Text>یافت نشد</Text>;
  return (
    <ScrollView contentContainerStyle={{padding:16}}>
      <Text style={{fontWeight:'700'}}>{data.title}</Text>
      {data.questions.map(q=> <ViewQ key={q.id} q={q} onChange={(v)=> setAnswers({...answers,[q.id]:v})} />)}
      <Button title={submitting? '...' : 'ارسال'} onPress={()=> submit(id, answers)} />
    </ScrollView>
  );
}
function ViewQ({ q, onChange }: any){
  if(q.type==='bool') return <><Text>{q.label}</Text><Button title="بله/خیر" onPress={()=> onChange(true)} /></>;
  if(q.type==='scale') return <><Text>{q.label}</Text><TextInput keyboardType="numeric" onChangeText={(t)=> onChange(Number(t||'0'))} /></>;
  return <><Text>{q.label}</Text><TextInput onChangeText={onChange} /></>;
}
