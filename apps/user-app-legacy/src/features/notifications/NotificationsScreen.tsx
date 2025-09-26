import React from 'react';
import { ScrollView, Text, Button, View } from 'react-native';
import { useNotifications, useMarkRead } from '../../../../packages/data/notifications/hooks';
export default function NotificationsScreen(){
  const { data, loading, error, reload } = useNotifications();
  const { mutate: mark, loading: marking } = useMarkRead();
  if(loading) return <Text>...</Text>;
  if(error) return <Text>خطا</Text>;
  return (
    <ScrollView contentContainerStyle={{padding:16}}>
      {(data||[]).map(n=> <View key={n.id} style={{opacity:n.read?0.6:1, marginBottom:8}}>
        <Text>{n.title}</Text>
        {!n.read && <Button title={marking? '...' : 'خواندم'} onPress={async()=>{ await mark(n.id); reload(); }} />}
      </View>)}
    </ScrollView>
  );
}
