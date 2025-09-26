import React from 'react';
import { ScrollView, Text } from 'react-native';
import { usePayroll } from '../../../../packages/data/payroll/hooks';
export default function PayrollScreen(){
  const { data, loading, error } = usePayroll();
  if(loading) return <Text>...</Text>;
  if(error) return <Text>Error</Text>;
  return (
    <ScrollView contentContainerStyle={{padding:16}}>
      <Text>جمع: {data?.total} {data?.currency}</Text>
      {data?.items.map(i=> <Text key={i.id}>{i.period} — {i.amount} — {i.status}</Text>)}
    </ScrollView>
  );
}
