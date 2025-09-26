
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';

export default function CoachOnboardingScreen({ navigation }: any){
  const [name, setName] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  return (
    <View style={{ flex:1, padding:16 }}>
      <Text style={{ fontSize:22, fontWeight:'800' }}>Coach Onboarding</Text>
      <TextInput value={name} onChangeText={setName} placeholder="نام نمایشی" style={{ borderWidth:1, borderColor:'#eee', padding:10, borderRadius:10, marginTop:12 }} />
      <View style={{ height:12 }} />
      <Text>تخصص‌ها (مثلاً: قدرتی، HIIT، کالیستنیکس)</Text>
      <View style={{ flexDirection:'row', flexWrap:'wrap', marginTop:8 }}>
        {['قدرتی','HIIT','کالیستنیکس','یوگا','پیلاتس'].map(s=> (
          <Text key={s} onPress={()=> setSkills(skills.includes(s)? skills.filter(x=>x!==s) : [...skills, s])} style={{ margin:4, padding:8, borderWidth:1, borderColor:'#eee', borderRadius:100, backgroundColor: skills.includes(s)? '#111':'#fff', color: skills.includes(s)? '#fff':'#111' }}>{s}</Text>
        ))}
      </View>
      <View style={{ height:16 }} />
      <TouchableOpacity onPress={()=> navigation.replace('Home')}><Text style={{ padding:12, backgroundColor:'#111', color:'#fff', textAlign:'center', borderRadius:10 }}>شروع</Text></TouchableOpacity>
    </View>
  );
}
