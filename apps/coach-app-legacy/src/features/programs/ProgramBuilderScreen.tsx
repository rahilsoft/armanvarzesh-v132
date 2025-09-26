import React from 'react';
import { ScrollView, Text, TextInput, Button } from 'react-native';
import { useProgramCreate } from '../../../../packages/data/programs/hooks';
export default function ProgramBuilderScreen(){
  const { mutate: create, loading } = useProgramCreate();
  const [title,setTitle] = React.useState('برنامه جدید');
  return (
    <ScrollView contentContainerStyle={{padding:16}}>
      <Text>سازنده برنامه</Text>
      <TextInput value={title} onChangeText={setTitle} />
      <Button title={loading? '...' : 'ساخت'} onPress={()=> create({ id: String(Date.now()), title, weeks:4, level:'beginner', plan:[{day:1, workoutId:'w1'}] } as any)} />
    </ScrollView>
  );
}
