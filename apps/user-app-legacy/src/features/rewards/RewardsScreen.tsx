import React from 'react';
import { ScrollView, Text, Button } from 'react-native';
import { useRewards, useEarn, useRedeem } from '../../../../packages/data/rewards/hooks';
export default function RewardsScreen(){
  const { data, loading, error, reload } = useRewards();
  const { mutate: earn, loading: earning } = useEarn();
  const { mutate: redeem, loading: redeeming } = useRedeem();
  if(loading) return <Text>...</Text>;
  if(error) return <Text>خطا</Text>;
  return (
    <ScrollView contentContainerStyle={{padding:16}}>
      <Text>امتیاز: {data?.balance}</Text>
      <Button title={earning? '...' : 'کسب ۲۰'} onPress={async()=>{ await earn(20); reload(); }} />
      <Button title={redeeming? '...' : 'خرج ۱۰'} onPress={async()=>{ await redeem(10); reload(); }} />
      {(data?.history||[]).map(h=> <Text key={h.id}>{h.type} — {h.points}</Text>)}
    </ScrollView>
  );
}
