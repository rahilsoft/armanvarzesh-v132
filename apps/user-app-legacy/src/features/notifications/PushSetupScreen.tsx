import React from 'react';
import { View, Text, Button } from 'react-native';
import { useRegisterDevice } from '../../../../packages/data/notifications/hooks';
export default function PushSetupScreen(){
  const { mutate: register, loading } = useRegisterDevice();
  return (
    <View style={{padding:16}}>
      <Text>فعال‌سازی پوش</Text>
      <Button title={loading? '...' : 'Enable'} onPress={async()=>{
        const token = 'rn-'+Math.random().toString(36).slice(2);
        await register({ platform:'android', token, lastSeen: Date.now() });
        alert('Push enabled');
      }} />
    </View>
  );
}
