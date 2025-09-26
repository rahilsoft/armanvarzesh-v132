import React from 'react';
import { ScrollView, Text, Button } from 'react-native';
import { useScheduleAdd } from '../../../../packages/data/schedule/hooks';
export default function AssignScreen(){
  const { mutate: add, loading } = useScheduleAdd();
  return (
    <ScrollView contentContainerStyle={{padding:16}}>
      <Text>انتساب جلسه</Text>
      <Button title={loading? '...' : 'افزودن جلسه فردا'} onPress={()=> add(new Date(Date.now()+86400000).toISOString(),'w1','p1')} />
    </ScrollView>
  );
}
