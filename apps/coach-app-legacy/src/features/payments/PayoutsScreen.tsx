import React from 'react';
import { View, Text } from 'react-native';
import { useWallet } from '../../../../packages/data/payments/hooks';
export default function PayoutsScreen(){
  const { data, loading, error } = useWallet();
  if(loading) return <Text>Loading…</Text>;
  if(error) return <Text>Error</Text>;
  return (
    <View style={{padding:16}}>
      <Text style={{fontWeight:'700'}}>برداشت مربی</Text>
      <Text>موجودی پلتفرم (نمایشی): {data?.balance} {data?.currency}</Text>
    </View>
  );
}
