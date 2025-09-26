import React, { useEffect, useState } from 'react';
import { View, Text, Button, TextInput, ScrollView } from 'react-native';

const API = process.env.EXPO_PUBLIC_BOOKING_URL || 'http://localhost:4069';

function toLocal(iso:string, tz?:string){
  const d = new Date(iso);
  const fmt = new Intl.DateTimeFormat(undefined, { timeZone: tz || Intl.DateTimeFormat().resolvedOptions().timeZone, year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit' });
  return fmt.format(d);
}

export default function BookingCalendar(){
  const [coachId, setCoachId] = useState('coach-1');
  const [slotId, setSlotId] = useState('');
  const [mode, setMode] = useState('online');
  const [mine, setMine] = useState<any>(null);
  const auth = { authorization:'Bearer dev-u1' };

  const refresh = ()=> fetch(`${API}/booking/mine`, { headers: auth }).then(r=>r.json()).then(setMine);

  const create = async ()=>{
    const res = await fetch(`${API}/booking/create`, { method:'POST', headers:{ 'content-type':'application/json', ...auth }, body: JSON.stringify({ coachId, slotId, mode }) }).then(r=>r.json());
    alert('Checkout: '+res.paymentCheckoutUrl);
    refresh();
  };

  useEffect(()=>{ refresh(); },[]);

  return <ScrollView style={{ padding:16 }}>
    <Text style={{ fontSize:18, fontWeight:'700' }}>My Bookings</Text>
    <View style={{ marginTop:8 }}>
      <Text>CoachId</Text>
      <TextInput value={coachId} onChangeText={setCoachId} style={{ borderWidth:1, padding:8, borderRadius:8 }} />
      <Text>SlotId</Text>
      <TextInput value={slotId} onChangeText={setSlotId} style={{ borderWidth:1, padding:8, borderRadius:8, marginBottom:8 }} />
      <Button title="Create Booking" onPress={create} />
    </View>
    <View style={{ marginTop:16 }}>
      {mine?.items?.map((b:any)=>(
        <View key={b.id} style={{ padding:8, borderWidth:1, borderRadius:8, marginBottom:8 }}>
          <Text>Status: {b.status}</Text>
          <Text>Start: {toLocal(b.slot.startUTC)}</Text>
          <Text>End: {toLocal(b.slot.endUTC)}</Text>
        </View>
      ))}
    </View>
  </ScrollView>;
}
