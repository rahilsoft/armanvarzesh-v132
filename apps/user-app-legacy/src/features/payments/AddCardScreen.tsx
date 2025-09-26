import React from 'react';
import { ScrollView, Text, TextInput, Button } from 'react-native';
import { useTokenizeCard, useAttachCard } from '../../../../packages/data/payments/hooks';
export default function AddCardScreen(){
  const { mutate: tokenize, loading: tokenizing } = useTokenizeCard();
  const { mutate: attach, loading: attaching } = useAttachCard();
  const [number,setNumber] = React.useState('4242424242424242');
  const [exp,setExp] = React.useState('12/27');
  const [cvc,setCvc] = React.useState('123');
  return (
    <ScrollView contentContainerStyle={{padding:16}}>
      <Text>افزودن کارت</Text>
      <TextInput value={number} onChangeText={setNumber} placeholder="شماره کارت" />
      <TextInput value={exp} onChangeText={setExp} placeholder="MM/YY" />
      <TextInput value={cvc} onChangeText={setCvc} placeholder="CVC" />
      <Button title={tokenizing||attaching? '...' : 'ذخیره کارت'} onPress={async()=>{ const t = await tokenize(number,exp,cvc); await attach(t); alert('کارت ذخیره شد'); }} />
    </ScrollView>
  );
}
