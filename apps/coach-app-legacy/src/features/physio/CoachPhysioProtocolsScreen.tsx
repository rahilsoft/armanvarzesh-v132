import React from 'react';
import { ScrollView, Text } from 'react-native';
import { useProtocols } from '../../../../packages/data/physio/hooks';
export default function CoachPhysioProtocolsScreen(){
  const { data, loading } = useProtocols();
  if(loading) return <Text>...</Text>;
  return (
    <ScrollView contentContainerStyle={{padding:16}}>
      {(data||[]).map(p=> <Text key={p.id}>{p.title} — {p.focus}</Text>)}
    </ScrollView>
  );
}
