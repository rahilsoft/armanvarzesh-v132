import React, { useEffect, useState } from 'react';
import { View, Text, Button, TextInput, ScrollView } from 'react-native';

const API = process.env.EXPO_PUBLIC_MEDICAL_URL || 'http://localhost:4065';

export default function MedicalDirectory(){
  const [catalog, setCatalog] = useState<any>(null);
  const [facilityId, setFacilityId] = useState('fac-amsterdam-1');
  const [doctorId, setDoctorId] = useState('doc-van-rijn');
  const [slot, setSlot] = useState('slot-1');
  const [tests, setTests] = useState<string[]>(['test-fasting-glucose']);
  const [resp, setResp] = useState<any>(null);

  useEffect(()=>{
    fetch(`${API}/medical/testsCatalog`, { headers:{ authorization:'Bearer dev-u1' }}).then(r=>r.json()).then(setCatalog);
  },[]);

  const book = async ()=>{
    const res = await fetch(`${API}/medical/bookAppointment`, {
      method:'POST', headers:{ 'content-type':'application/json', authorization:'Bearer dev-u1' },
      body: JSON.stringify({ facilityId, doctorId, tests, slot })
    }).then(r=>r.json());
    setResp(res);
  };

  return <ScrollView style={{ padding:16 }}>
    <Text style={{ fontSize:18, fontWeight:'700' }}>Medical Tests</Text>
    <Text style={{ marginTop:8 }}>Facility: {facilityId}</Text>
    <Text>Doctor: {doctorId}</Text>
    <TextInput placeholder="slot-id" value={slot} onChangeText={setSlot} style={{ borderWidth:1, padding:8, borderRadius:8, marginTop:8 }}/>
    <Button title="Book Appointment" onPress={book} />
    {resp && <View style={{ marginTop:16 }}>
      <Text style={{ fontWeight:'600' }}>Booked</Text>
      <Text selectable>{JSON.stringify(resp,null,2)}</Text>
    </View>}
  </ScrollView>;
}
