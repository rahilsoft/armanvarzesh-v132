import React from 'react';
import { ScrollView, View, Text, TextInput, Button } from 'react-native';
import { useChat } from '../../../../packages/data/chat/hooks';
export default function ChatScreen(){
  const { messages, sendText } = useChat({ id:'c1', name:'You', role:'coach' }, 'r_support');
  const [text,setText] = React.useState('');
  return (
    <View style={{flex:1}}>
      <ScrollView contentContainerStyle={{padding:16, flexGrow:1}}>
        {(messages||[]).map(m=> <Text key={m.id} style={{textAlign: m.from==='u1'?'left':'right'}}>{m.kind==='text'? m.body : m.kind}</Text>)}
      </ScrollView>
      <View style={{flexDirection:'row', padding:8, gap:8}}>
        <TextInput style={{flex:1, borderWidth:1, padding:8}} value={text} onChangeText={setText} />
        <Button title="ارسال" onPress={async()=>{ if(text.trim().length){ await sendText('admin', text.trim()); setText(''); } }} />
      </View>
    </View>
  );
}
