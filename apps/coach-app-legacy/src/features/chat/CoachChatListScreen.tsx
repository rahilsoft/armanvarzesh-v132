import React from 'react';
import { ScrollView, Text, TouchableOpacity } from 'react-native';
import { useThreads } from '../../../../packages/data/chat/hooks';
export default function CoachChatListScreen({ navigation }: any){
  const { data, loading } = useThreads();
  if(loading) return <Text>...</Text>;
  return (
    <ScrollView contentContainerStyle={{padding:16}}>
      {data?.map(t=> <TouchableOpacity key={t.id} onPress={()=> navigation.navigate('CoachChatRoom', { id: t.id })}><Text>{t.title}</Text></TouchableOpacity>)}
    </ScrollView>
  );
}
