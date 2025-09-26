
import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert } from 'react-native';
import { useMutation } from '@apollo/client';
import { UPSERT_CLIENT } from '@graphql/queries/clients.queries';

export default function AddClientScreen({ navigation } : any){
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [save, { loading }] = useMutation(UPSERT_CLIENT);

  const onSave = async ()=>{
    if (!name || name.length<2) return setError('نام معتبر نیست');
    if (!email.includes('@')) return setError('ایمیل نامعتبر است');
    setError('');
    try{
      await save({ variables: { input: { name, email, phone } }, refetchQueries:['Clients'] });
      Alert.alert('ثبت شد', 'مشتری جدید افزوده شد');
      navigation.goBack();
    }catch(e:any){ setError(e?.message || 'خطا در ذخیره'); }
  };
  return (
    <View style={{flex:1, padding:16}}>
      {!!error && <Text style={{color:'crimson', marginBottom:8}}>{error}</Text>}
      <TextInput placeholder="نام" value={name} onChangeText={setName} style={st.in} />
      <TextInput placeholder="ایمیل" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" style={st.in} />
      <TextInput placeholder="تلفن" value={phone} onChangeText={setPhone} keyboardType="phone-pad" style={st.in} />
      <Button title={loading?'...':'ذخیره'} onPress={onSave} />
    </View>
  );
}
const st = { in: { borderWidth:1, borderColor:'#eee', borderRadius:10, paddingHorizontal:12, height:44, marginBottom:10 } };
