
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useMutation } from '@apollo/client';
import { ASSIGN_PLAN } from '@graphql/queries/plans.queries';

export default function AssignPlanScreen({ route, navigation } : any){
  const planId = route.params?.planId;
  const defaultClientId = route.params?.clientId || '';
  const [clientId, setClientId] = useState(defaultClientId);
  const [startDate, setStartDate] = useState('2025-09-01');
  const [assign, { loading }] = useMutation(ASSIGN_PLAN);
  return (
    <View style={{ flex:1, padding:16 }}>
      <Text>اختصاص برنامه</Text>
      <TextInput placeholder="Client ID" value={clientId} onChangeText={setClientId} style={st.in} />
      <TextInput placeholder="تاریخ شروع (YYYY-MM-DD)" value={startDate} onChangeText={setStartDate} style={st.in} />
      <Button title={loading?'...':'اختصاص'} onPress={async ()=>{
        if (!planId) return Alert.alert('شناسه برنامه یافت نشد');
        await assign({ variables: { planId, clientId, startDate } });
        Alert.alert('اختصاص داده شد'); navigation.goBack();
      }} />
    </View>
  );
}
const st = { in: { borderWidth:1, borderColor:'#eee', borderRadius:10, paddingHorizontal:12, height:44, marginBottom:10 } };
