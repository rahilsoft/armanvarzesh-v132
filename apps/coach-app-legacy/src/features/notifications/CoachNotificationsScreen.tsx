import React from 'react';
import { ScrollView, Text } from 'react-native';
import { useNotifications } from '../../../../packages/data/notifications/hooks';
export default function CoachNotificationsScreen(){
  const { data, loading } = useNotifications();
  return (
    <ScrollView contentContainerStyle={{padding:16}}>
      {loading? <Text>Loading…</Text> : data?.map(n=> <Text key={n.id}>{n.title}</Text>)}
    </ScrollView>
  );
}
