/* RN User — BookingListScreen */
import React from 'react';
import { View, Text, Button, ScrollView, I18nManager } from 'react-native';
import { useListBookings, useCancelBooking } from '../../../../packages/data/booking/hooks';

export default function BookingListScreen(){
  const { data, loading, error, reload } = useListBookings();
  const { mutate: cancel, loading: cancelling } = useCancelBooking();
  return (
    <ScrollView contentContainerStyle={{ padding:16 }} style={{ direction: I18nManager.isRTL? 'rtl':'ltr' as any }}>
      {loading && <Text>در حال بارگذاری…</Text>}
      {error && <Text>خطا</Text>}
      {!loading && !error && (!data || data.length===0) && <Text>موردی یافت نشد</Text>}
      {data?.map(b=> (
        <View key={b.id} style={{borderWidth:1,borderColor:'#1f2a3a',marginBottom:12,padding:12,borderRadius:8}}>
          <Text>{b.when} — {b.notes || '—'} — {b.status}</Text>
          {b.status!=='canceled' && <Button title={cancelling? '...' : 'لغو'} onPress={async()=>{ await cancel(b.id); reload(); }} />}
        </View>
      ))}
    </ScrollView>
  );
}
