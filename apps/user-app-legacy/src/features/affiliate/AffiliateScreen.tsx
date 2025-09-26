import React from 'react';
import { ScrollView, Text, Button } from 'react-native';
import { useAffiliate, useAffiliatePayout } from '../../../../packages/data/affiliate/hooks';
export default function AffiliateScreen(){
  const { data, loading, error, reload } = useAffiliate();
  const { mutate: payout, loading: paying } = useAffiliatePayout();
  if(loading) return <Text>...</Text>;
  if(error) return <Text>خطا</Text>;
  return (
    <ScrollView contentContainerStyle={{padding:16}}>
      <Text>کد: {data?.code}</Text>
      <Text>کلیک‌ها: {data?.clicks} — ثبت‌نام‌ها: {data?.signups}</Text>
      <Text>کارمزد: {data?.commission} {data?.currency}</Text>
      <Button title={paying? '...' : 'درخواست تسویه'} onPress={async()=>{ await payout(); reload(); }} />
    </ScrollView>
  );
}
