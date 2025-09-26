import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView } from 'react-native';
import { useMessages, useSend } from '../../../../packages/data/chat/hooks';
export default function CoachChatRoomScreen({ route }: any){
  const id = route?.params?.id || 't-1';
  const { data, loading, error, reload } = useMessages(String(id));
  const { mutate: send, loading: sending } = useSend();
  const [text,setText] = useState('');
  return (
    <View style={{flex:1, padding:16}}>
      <ScrollView style={{flex:1}}>
        {loading? <Text>...</Text> : error? <Text>Error</Text> :
          data?.map(m=> <Text key={m.id} style={{marginVertical:4, textAlign: m.from==='coach'?'right':'left'}}>{m.body}</Text>)
        }
      </ScrollView>
      <View style={{flexDirection:'row', gap:8, alignItems:'center'}}>
        <TextInput value={text} onChangeText={setText} style={{borderWidth:1, flex:1, padding:8, borderRadius:8}} />
        <Button title={sending? '...' : 'ارسال'} onPress={async()=>{ await send(String(id), text); setText(''); reload(); }} />
      </View>
    </View>
  );
}
