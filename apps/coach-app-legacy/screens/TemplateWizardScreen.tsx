
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { gql, useMutation } from '@apollo/client';

const CREATE = gql`mutation($template:String!, $ownerId:String!, $title:String, $description:String){ createPlanFromTemplate(template:$template, ownerId:$ownerId, title:$title, description:$description){ id title status version } }`;

const TEMPLATES = [
  { key:'FULL_BODY_3D', title:'فول‌بادی ۳ روزه' },
  { key:'UPPER_LOWER_4D', title:'بالاتنه/پایین‌تنه ۴ روزه' },
  { key:'PPL_6D', title:'Push/Pull/Legs — ۶ روزه' },
];

export default function TemplateWizardScreen({ navigation, route } : any){
  const coachId = route?.params?.coachId || 'demo-coach';
  const [sel, setSel] = useState<string>('FULL_BODY_3D');
  const [title, setTitle] = useState<string>('');
  const [desc, setDesc] = useState<string>('');
  const [create, { loading }] = useMutation(CREATE);

  const submit = async ()=>{
    const r = await create({ variables: { template: sel, ownerId: coachId, title: title||null, description: desc||null } });
    const id = r.data?.createPlanFromTemplate?.id;
    if (id){ Alert.alert('ساخته شد', 'برنامهٔ تمپلیت ایجاد شد.'); navigation.navigate('PlanEditor', { id }); }
  };

  return (
    <ScrollView contentContainerStyle={{ padding:12, gap:10 }}>
      <Text style={{ fontWeight:'800', fontSize:18 }}>تمپلیت برنامه</Text>
      <View style={{ flexDirection:'row', flexWrap:'wrap' }}>
        {TEMPLATES.map(t=> (
          <Text key={t.key} onPress={()=> setSel(t.key)} style={{ margin:4, padding:8, borderWidth:1, borderColor:'#eee', borderRadius:100, backgroundColor: sel===t.key? '#111':'#fff', color: sel===t.key? '#fff':'#111' }}>{t.title}</Text>
        ))}
      </View>
      <TextInput placeholder="عنوان سفارشی (اختیاری)" value={title} onChangeText={setTitle} style={{ borderWidth:1, borderColor:'#eee', borderRadius:10, paddingHorizontal:10, height:42 }} />
      <TextInput placeholder="توضیح (اختیاری)" value={desc} onChangeText={setDesc} style={{ borderWidth:1, borderColor:'#eee', borderRadius:10, paddingHorizontal:10, height:90, textAlignVertical:'top' }} multiline />
      <TouchableOpacity onPress={submit} disabled={loading}><Text style={{ padding:12, textAlign:'center', borderRadius:10, backgroundColor:'#111', color:'#fff' }}>{loading ? '...' : 'ساخت برنامه از تمپلیت'}</Text></TouchableOpacity>
    </ScrollView>
  );
}
