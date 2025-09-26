import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView } from 'react-native';
import { useWallet, useAddFunds, usePay } from '../../../../packages/data/payments/hooks';
export default function WalletScreen(){
  const { data, loading, error, reload } = useWallet();
  const { mutate: add, loading: adding } = useAddFunds();
  const { mutate: pay, loading: paying } = usePay();
  const [amount,setAmount] = useState('100000');
  if(loading) return <Text>در حال بارگذاری…</Text>;
  if(error) return <Text>خطا</Text>;
  return (
    <ScrollView contentContainerStyle={{padding:16}}>
      <Text>موجودی: {data?.balance} {data?.currency}</Text>
      <View style={{marginTop:12}}>
        <Text>افزودن اعتبار</Text>
        <TextInput value={amount} onChangeText={setAmount} keyboardType="numeric" style={{borderWidth:1,borderRadius:8,padding:8}} />
        <Button title={adding?'...':'افزودن'} onPress={async()=>{ await add(Number(amount||'0'),'card'); reload(); }} />
      </View>
      <View style={{marginTop:16}}>
        {data?.history.map(h=> <Text key={h.id}>{h.type} — {h.amount}</Text>)}
      </View>
      <Button title={paying?'...':'پرداخت نمونه'} onPress={async()=>{ await pay(50000,'sample'); reload(); }} />
    </ScrollView>
  );
}
