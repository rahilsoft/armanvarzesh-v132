import React from 'react';
import { ScrollView, Text } from 'react-native';
import { useVip } from '../../../../packages/data/vip/hooks';
export default function VipScreen(){
  const { tiers, state, loading } = useVip();
  if(loading) return <Text>...</Text>;
  return (
    <ScrollView contentContainerStyle={{padding:16}}>
      <Text>سطح فعلی: {state?.tier?.name}</Text>
      {tiers?.map(t=> <Text key={t.id}>{t.name} — {t.benefits.join(', ')}</Text>)}
    </ScrollView>
  );
}
