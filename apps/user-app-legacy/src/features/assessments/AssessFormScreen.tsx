import React from 'react';
import { ScrollView, Text, TextInput, Button } from 'react-native';
import { useAssessTemplate, useAssessSubmit, useDraftSave } from '../../../../packages/data/assessments/hooks';
export default function AssessFormScreen(){
  const { data: tpl, loading } = useAssessTemplate();
  const { mutate: submit, loading: submitting } = useAssessSubmit();
  const { mutate: saveDraft, saving } = useDraftSave();
  const [step,setStep] = React.useState(1);
  const [values,setValues] = React.useState<any>({});
  if(loading) return <Text>...</Text>;
  const current = tpl?.steps?.[step-1];
  return (
    <ScrollView contentContainerStyle={{padding:16}}>
      <Text>{tpl?.title}</Text>
      {(current?.fields||[]).map((f:any)=>(
        <React.Fragment key={f.id}>
          <Text>{f.label}</Text>
          <TextInput value={String(values[f.id]||'')} onChangeText={(t)=> setValues((v:any)=>({...v,[f.id]:t}))} />
        </React.Fragment>
      ))}
      <Button title="ذخیره" onPress={()=> saveDraft({ id:'draft', templateId: tpl?.id, values, step, updatedAt: Date.now() } as any)} />
      {step<(tpl?.steps?.length||1) ? <Button title="بعدی" onPress={()=> setStep(step+1)} /> : <Button title={submitting? '...' : 'ارسال'} onPress={()=> submit(values, tpl?.id||'gen-health')} />}
    </ScrollView>
  );
}
