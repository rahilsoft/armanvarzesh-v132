
import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { useAuth } from '../hooks/useAuth';
import { cacheGet, cacheSet } from '../features/offlineCache';
import { xorDecrypt } from '../features/crypto';

const API = process.env.API_URL || 'http://localhost:8080';

export default function CoursePlayerScreen(){
  const { token } = useAuth();
  const [manifest, setManifest] = useState<any>(null);
  const [license, setLicense] = useState<string>('');
  const courseId = 1; // sample

  const load = async ()=>{
    const m = await fetch(`${API}/v1/courses/${courseId}/manifest`, { headers: { 'Authorization': `Bearer ${token}` }}).then(r=>r.json());
    setManifest(m);
    const deviceId = DeviceInfo.getUniqueIdSync?.() || 'simulator';
    const lic = await fetch(`${API}/v1/courses/${courseId}/license`, { method:'POST', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type':'application/json' }, body: JSON.stringify({ deviceId }) }).then(r=>r.json());
    setLicense(lic?.token||'');
  };

  const downloadChunk = async (asset:any)=>{
    // In production: fetch encrypted bytes; here we simulate with payload text.
    const encPayload = btoa(`CHUNK_${asset.idx}_DATA`);
    await cacheSet(`course:${courseId}:chunk:${asset.idx}`, encPayload);
  };

  const playChunk = async (asset:any)=>{
    const enc = await cacheGet(`course:${courseId}:chunk:${asset.idx}`);
    if(!enc){ return; }
    const data = xorDecrypt(enc, license||'k'); // simulate device-bound decryption
    alert('Playing asset #' + asset.idx + ' data=' + data.slice(0,16));
  };

  useEffect(()=>{ load(); },[]);
  return (
    <View style={{ padding:16 }}>
      <Text accessibilityRole='header' style={{ fontSize:22, fontWeight:'700' }}>Course Player</Text>
      <Text>License: {license ? 'Ready' : '—'}</Text>
      <FlatList data={manifest?.assets||[]} keyExtractor={(i)=> String(i.id)} renderItem={({item})=>(
        <View style={{ borderWidth:1, padding:12, marginVertical:6 }}>
          <Text>Chunk #{item.idx} • {item.durationS}s</Text>
          <View style={{ flexDirection:'row', gap:8 }}>
            <Button title="Download" onPress={()=> downloadChunk(item)} />
            <Button title="Play" onPress={()=> playChunk(item)} />
          </View>
        </View>
      )} />
    </View>
  );
}
