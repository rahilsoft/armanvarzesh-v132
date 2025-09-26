import React from 'react';
import { ScrollView, Text, TextInput, Button } from 'react-native';
import { useSurvey, useSurveySubmit } from '../../../../packages/data/surveys/hooks';
export default function SurveyScreen(){
  const { data, loading } = useSurvey('sv_nps');
  const { mutate: submit, loading: sending } = useSurveySubmit();
  const [answers,setAnswers] = React.useState<any>({});
  if(loading) return <Text>...</Text>;
  return (
    <ScrollView contentContainerStyle={{padding:16}}>
      <Text>{data?.title}</Text>
      {(data?.questions||[]).map(q=> <React.Fragment key={q.id}>
        <Text>{q.text}</Text>
        <TextInput value={String(answers[q.id]||'')} onChangeText={(t)=> setAnswers((a:any)=>({...a,[q.id]:t}))} />
      </React.Fragment>)}
      <Button title={sending? '...' : 'ارسال'} onPress={()=> submit('sv_nps', answers)} />
    </ScrollView>
  );
}
