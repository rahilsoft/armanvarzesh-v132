import React, { useEffect, useState } from 'react';
import { View, Text, Button, TextInput, ScrollView } from 'react-native';
import { myBookings, hold, createBooking, cancelBooking, reschedule } from './api';

function toLocal(utcIso:string){
  const d = new Date(utcIso);
  return d.toLocaleString(undefined, { hour:'2-digit', minute:'2-digit', day:'2-digit', month:'short', timeZoneName:'short' });
}

export default function BookingFlow(){
  const [bookings, setBookings] = useState<any[]>([]);
  const [slotId, setSlotId] = useState('');
  const [bookingId, setBookingId] = useState('');
  const [coachId, setCoachId] = useState('coach-1');
  const [log, setLog] = useState<string[]>([]);

  const refresh = async ()=>{
    const res = await myBookings();
    setBookings(res.items||[]);
  };
  useEffect(()=>{ refresh(); },[]);

  const onHold = async ()=>{
    const r = await hold(slotId);
    setLog(l=>[...l, 'Hold token '+JSON.stringify(r)]);
  };
  const onCreate = async ()=>{
    const r = await createBooking(coachId, slotId, 'online');
    setLog(l=>[...l, 'Created booking '+JSON.stringify(r)]);
    refresh();
  };
  const onCancel = async ()=>{
    const r = await cancelBooking(bookingId);
    setLog(l=>[...l, 'Cancelled '+JSON.stringify(r)]);
    refresh();
  };
  const onResched = async ()=>{
    const r = await reschedule(bookingId, slotId);
    setLog(l=>[...l, 'Rescheduled '+JSON.stringify(r)]);
    refresh();
  };

  return <ScrollView style={{ padding:16 }}>
    <Text style={{ fontSize:18, fontWeight:'700' }}>Booking</Text>
    <TextInput value={slotId} onChangeText={setSlotId} placeholder="slotId" style={{ borderWidth:1, padding:8, marginVertical:4 }} />
    <Button title="Hold Slot" onPress={onHold} />
    <Button title="Create Booking" onPress={onCreate} />

    <TextInput value={bookingId} onChangeText={setBookingId} placeholder="bookingId" style={{ borderWidth:1, padding:8, marginVertical:4 }} />
    <Button title="Cancel Booking" onPress={onCancel} />
    <Button title="Reschedule" onPress={onResched} />

    <Text style={{ marginTop:12, fontWeight:'700' }}>My Bookings</Text>
    {bookings.map((b,i)=>(<View key={i} style={{ padding:8, borderBottomWidth:1 }}>
      <Text>{b.id} — {b.status}</Text>
      <Text>{toLocal(b.slot.startUTC)} → {toLocal(b.slot.endUTC)}</Text>
    </View>))}
    {log.map((x,i)=>(<Text key={i}>{x}</Text>))}
  </ScrollView>;
}
