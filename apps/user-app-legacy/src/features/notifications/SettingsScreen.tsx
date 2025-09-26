import React from 'react';
import { ScrollView, Text, Switch, View } from 'react-native';
import { useNotifPrefs } from '../../../../packages/data/notifications/hooks';
export default function SettingsScreen(){
  const { data: prefs, save } = useNotifPrefs();
  return (
    <ScrollView contentContainerStyle={{padding:16}}>
      <Text>تنظیمات اعلان</Text>
      <View style={{flexDirection:'row', gap:12, alignItems:'center'}}>
        <Text>Push</Text><Switch value={!!prefs?.push} onValueChange={(v)=> save({ push:v })} />
      </View>
      <View style={{flexDirection:'row', gap:12, alignItems:'center'}}>
        <Text>Email</Text><Switch value={!!prefs?.email} onValueChange={(v)=> save({ email:v })} />
      </View>
      <View style={{flexDirection:'row', gap:12, alignItems:'center'}}>
        <Text>SMS</Text><Switch value={!!prefs?.sms} onValueChange={(v)=> save({ sms:v })} />
      </View>
    </ScrollView>
  );
}
