import React from 'react';
import { ScrollView, Text, Button } from 'react-native';
export default function AssessIntroScreen({ navigation }:any){
  return (
    <ScrollView contentContainerStyle={{padding:16}}>
      <Text>ارزیابی سلامت</Text>
      <Button title="شروع" onPress={()=> navigation.navigate('AssessForm')} />
    </ScrollView>
  );
}
