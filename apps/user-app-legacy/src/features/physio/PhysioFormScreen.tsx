import React from 'react';
import { ScrollView, Text, Button } from 'react-native';
import { useProtocols, useAssign } from '../../../../packages/data/physio/hooks';
export default function PhysioFormScreen(){
  const { data, loading } = useProtocols();
  const { mutate: assign, loading: assigning } = useAssign();
  if(loading) return <Text>...</Text>;
  return (
    <ScrollView contentContainerStyle={{padding:16}}>
      {(data||[]).map(p=> <React.Fragment key={p.id}>
        <Text>{p.title}</Text>
        <Button title={assigning? '...' : 'انتساب'} onPress={()=> assign(p.id)} />
      </React.Fragment>)}
    </ScrollView>
  );
}
