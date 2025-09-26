import React, { useEffect, useState } from 'react';
import { View, Text, Button, TextInput, ScrollView } from 'react-native';

const API = process.env.EXPO_PUBLIC_ASSESSMENTS_URL || 'http://localhost:4063';

type Question = { id:string, type:string, text:string, options?:string[] };
type Section = { id:string, title:string, order:number, questions: Question[] };
type Assessment = { id:string, name:string, sections: Section[] };

export default function AssessmentWizard(){
  const [assess, setAssess] = useState<Assessment|null>(null);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [result, setResult] = useState<any>(null);

  useEffect(()=>{
    fetch(`${API}/assessments/assess-mobility-basic`,{ headers:{ authorization: 'Bearer dev-u1' }})
      .then(r=>r.json()).then(setAssess).catch(console.error);
  },[]);

  const submit = async ()=>{
    const payload = { answers: Object.entries(answers).map(([questionId, value])=>({ questionId, value })) };
    const res = await fetch(`${API}/assessments/${assess?.id}/submit`, {
      method:'POST', headers:{ 'content-type':'application/json', authorization: 'Bearer dev-u1' }, body: JSON.stringify(payload)
    }).then(r=>r.json());
    setResult(res);
  };

  return <ScrollView style={{ padding:16 }}>
    <Text style={{ fontSize:18, fontWeight:'700' }}>{assess?.name||'Loading...'}</Text>
    {assess?.sections?.map(sec=>(
      <View key={sec.id} style={{ marginTop:12 }}>
        <Text style={{ fontWeight:'600' }}>{sec.title}</Text>
        {sec.questions.map(q=>(
          <View key={q.id} style={{ marginTop:8 }}>
            <Text>{q.text}</Text>
            {q.type==='number' ? (
              <TextInput keyboardType="numeric" style={{ borderWidth:1,padding:8,borderRadius:8 }} onChangeText={(t)=> setAnswers(a=>({...a,[q.id]: Number(t)}))} />
            ) : q.type==='single' && q.options ? (
              <View style={{ flexDirection:'row', gap:8, flexWrap:'wrap' }}>
                {q.options.map(opt=>(
                  <Button key={opt} title={opt} onPress={()=> setAnswers(a=>({...a,[q.id]: opt}))} />
                ))}
              </View>
            ) : (
              <TextInput style={{ borderWidth:1,padding:8,borderRadius:8 }} onChangeText={(t)=> setAnswers(a=>({...a,[q.id]: t}))} />
            )}
          </View>
        ))}
      </View>
    ))}
    <View style={{ marginTop:16 }}>
      <Button title="Submit" onPress={submit} />
    </View>
    {result && <View style={{ marginTop:16 }}>
      <Text style={{ fontWeight:'600' }}>Result</Text>
      <Text selectable>{JSON.stringify(result, null, 2)}</Text>
    </View>}
  </ScrollView>
}
