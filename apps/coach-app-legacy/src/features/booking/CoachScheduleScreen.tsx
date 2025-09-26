/* RN Coach — CoachScheduleScreen */
import React from 'react';
import { View, Text } from 'react-native';
import { useListBookings } from '../../../../packages/data/booking/hooks';
export default function CoachScheduleScreen(){
  const { data, loading, error } = useListBookings();
  if(loading) return <Text>Loading…</Text>;
  if(error) return <Text>Error</Text>;
  return (
    <View style={{padding:16}}>
      <Text style={{fontWeight:'700'}}>برنامه مربی</Text>
      {(!data || data.length===0) ? <Text>خالی</Text> : data.map(b=> <Text key={b.id}>{b.when} — {b.status}</Text>)}
    </View>
  );
}
