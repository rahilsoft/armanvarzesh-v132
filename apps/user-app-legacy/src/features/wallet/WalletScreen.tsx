import React from 'react';
import { ScrollView, Text, Button, TextInput } from 'react-native';
import { useWallet, useWalletHistory, useTopup, useWithdraw } from '../../../../packages/data/wallet/hooks';
export default function WalletScreen(){
  const { data, loading, error, reload } = useWallet();
  const { data: txns, reload: r2 } = useWalletHistory();
  const { mutate: topup, loading: topuping } = useTopup();
  const { mutate: withdraw, loading: withdrawing } = useWithdraw();
  const [amt,setAmt] = React.useState('50000');
  if(loading) return <Text>...</Text>;
  if(error) return <Text>خطا</Text>;
  return (
    <ScrollView contentContainerStyle={{padding:16}}>
      <Text>موجودی: {data?.balance} {data?.currency}</Text>
      <TextInput value={amt} onChangeText={setAmt} />
      <Button title={topuping? '...' : 'شارژ'} onPress={async()=>{ await topup(Number(amt||'0')); reload(); r2(); }} />
      <Button title={withdrawing? '...' : 'برداشت'} onPress={async()=>{ await withdraw(Number(amt||'0')); reload(); r2(); }} />
      <Text style={{marginTop:12}}>تاریخچه</Text>
      {(txns||[]).map(t=> <Text key={t.id}>{t.type} — {t.amount}</Text>)}
    </ScrollView>
  );
}
