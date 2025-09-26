import React from 'react';
import { ScrollView, Text, TouchableOpacity } from 'react-native';
import { useThreads } from '../../../../packages/data/chat/hooks';
export default function ChatListScreen({ navigation }: any){
  const { data, loading, error } = useThreads();
  if(loading) return <Text>در حال بارگذاری…</Text>;
  if(error) return <Text>خطا</Text>;
  return (
    <ScrollView contentContainerStyle={{padding:16}}>
      {data?.map(t=> (
        <TouchableOpacity key={t.id} onPress={()=> navigation.navigate('ChatRoom', { id: t.id })}>
          <Text style={{marginBottom:8}}>{t.title} {t.unread? `(${t.unread})` : ''}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
