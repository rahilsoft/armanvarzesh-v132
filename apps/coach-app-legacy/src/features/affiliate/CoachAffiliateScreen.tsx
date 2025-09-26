import React from 'react';
import { ScrollView, Text } from 'react-native';
import { useAffiliate } from '../../../../packages/data/affiliate/hooks';
export default function CoachAffiliateScreen(){
  const { data, loading } = useAffiliate();
  if(loading) return <Text>...</Text>;
  return (
    <ScrollView contentContainerStyle={{padding:16}}>
      <Text>کد: {data?.code}</Text>
      <Text>کلیک‌ها/ثبت‌نام‌ها: {data?.clicks}/{data?.signups}</Text>
      <Text>کارمزد: {data?.commission} {data?.currency}</Text>
    </ScrollView>
  );
}
