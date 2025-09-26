/* RN User — BookingCreateScreen */
import React, { useState } from 'react';
import { View, Text, TextInput, Button, I18nManager } from 'react-native';
import { useCreateBooking } from '../../../../packages/data/booking/hooks';

export default function BookingCreateScreen(){
  const { mutate, loading, error } = useCreateBooking();
  const [when,setWhen] = useState('');
  const [notes,setNotes] = useState('');
  return (
    <View style={{ padding:16, direction: I18nManager.isRTL? 'rtl':'ltr' as any }}>
      <Text style={{fontSize:20, fontWeight:'700'}}>رزرو جدید</Text>
      <Text>زمان</Text>
      <TextInput value={when} onChangeText={setWhen} placeholder="YYYY-MM-DDTHH:mm" style={{borderWidth:1,borderColor:'#1f2a3a',padding:8,borderRadius:8,color:'#e6ecf2'}} />
      <Text>یادداشت</Text>
      <TextInput value={notes} onChangeText={setNotes} placeholder="..." style={{borderWidth:1,borderColor:'#1f2a3a',padding:8,borderRadius:8,color:'#e6ecf2'}} />
      <Button title={loading? '...' : 'ثبت'} onPress={async()=>{ await mutate({when,notes}); setWhen(''); setNotes(''); }} disabled={loading} />
      {error && <Text>خطا: {String(error.message)}</Text>}
    </View>
  );
}
