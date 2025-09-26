import React from 'react';
import { ScrollView, Text, TouchableOpacity } from 'react-native';
import { useThreads, useInbox } from '../../../../packages/data/inbox/hooks';
export default function InboxScreen(){
  const { data: threads, loading } = useThreads();
  const first = threads?.[0]?.id || 't_system';
  const { data: items } = useInbox(first);
  if(loading) return <Text>...</Text>;
  return (
    <ScrollView contentContainerStyle={{padding:16}}>
      <Text>صندوق پیام</Text>
      {(items||[]).map(i=> <TouchableOpacity key={i.id}><Text>{i.title}</Text></TouchableOpacity>)}
    </ScrollView>
  );
}
