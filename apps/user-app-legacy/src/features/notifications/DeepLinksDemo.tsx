import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import * as Linking from 'expo-linking';

export default function NotificationDeepLinks(){
  const [last, setLast] = useState<string|undefined>();

  useEffect(()=>{
    const sub = Linking.addEventListener('url', ({ url })=>{
      setLast(url);
      // Parse and navigate in your router
      // e.g., app://session/<id> or app://booking/<id>
    });
    return ()=> sub.remove();
  },[]);

  return <View style={{ padding:16 }}>
    <Text style={{ fontSize:18, fontWeight:'700' }}>Notifications & Deep Links</Text>
    <Text>Last URL: {last}</Text>
    <Button title="Simulate Open Session" onPress={()=> Linking.openURL('arman://session/abc123')} />
    <Button title="Simulate Open Booking" onPress={()=> Linking.openURL('arman://booking/bk_1')} />
  </View>;
}
