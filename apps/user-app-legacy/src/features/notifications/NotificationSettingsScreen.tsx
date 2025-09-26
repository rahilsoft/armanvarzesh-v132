import React from 'react';
import { View, Text, Button } from 'react-native';
import { useEnablePush } from '../../../../packages/data/notifications/hooks';
export default function NotificationSettingsScreen(){
  const { mutate: enable, loading } = useEnablePush();
  return (
    <View style={{padding:16}}>
      <Text>تنظیمات اعلان</Text>
      <Button title={loading? '...' : 'فعال‌سازی پوش'} onPress={()=>enable()} />
    </View>
  );
}
