import React, { useState } from 'react';
import { ScrollView, Text, TextInput, Button } from 'react-native';
import { useCreateRoom } from '../../../../packages/data/live/hooks';
export default function GoLiveScreen(){
  const { mutate: create, loading } = useCreateRoom();
  const [title,setTitle] = useState('Live Workout');
  const [start,setStart] = useState(new Date().toISOString());
  return (
    <ScrollView contentContainerStyle={{padding:16}}>
      <Text>شروع پخش زنده</Text>
      <TextInput value={title} onChangeText={setTitle} placeholder="عنوان" />
      <TextInput value={start} onChangeText={setStart} placeholder="ISO" />
      <Button title={loading? '...' : 'ایجاد اتاق'} onPress={()=> create(title,start)} />
    </ScrollView>
  );
}
