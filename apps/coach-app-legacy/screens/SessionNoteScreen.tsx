
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { gql, useMutation } from '@apollo/client';

const REQ = gql`mutation($kind:String!,$ext:String!){ requestUploadUrl(kind:$kind, ext:$ext){ url } }`;
const SAVE = gql`mutation($in:UpsertSessionNoteInput!){ upsertSessionNote(input:$in){ id } }`;

export default function SessionNoteScreen({ route, navigation }: any){
  const { sessionId } = route.params || {};
  const [text, setText] = useState('');
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [busy, setBusy] = useState(false);
  const [req] = useMutation(REQ);
  const [save] = useMutation(SAVE);

  const start = async ()=>{
    try{
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const rec = new Audio.Recording();
      await rec.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await rec.startAsync();
      setRecording(rec);
    }catch(e:any){ Alert.alert('خطا در شروع ضبط', e?.message||''); }
  };

  const stop = async ()=>{
    try{
      if (!recording) return;
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);
      if (!uri) return;
      setBusy(true);
      const ext = 'm4a';
      const r = await req({ variables: { kind: 'audio', ext } });
      const payload = JSON.parse(r.data.requestUploadUrl.url);
      const up = await FileSystem.uploadAsync(payload.uploadUrl, uri, { httpMethod: 'PUT', uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT, headers: { 'Content-Type': 'audio/m4a' } });
      if (up.status<200 || up.status>=300) throw new Error('upload failed');
      await save({ variables: { in: { sessionId, audioUrl: payload.fileUrl, role:'COACH' } } });
      setBusy(false);
      Alert.alert('ثبت شد', 'یادداشت صوتی ذخیره شد');
      navigation.goBack();
    }catch(e:any){ setBusy(false); Alert.alert('خطا', e?.message||''); }
  };

  const submitText = async ()=>{
    if (!text.trim()) return;
    setBusy(true);
    try{
      await save({ variables: { in: { sessionId, text, role: 'COACH' } } });
      setBusy(false);
      Alert.alert('ثبت شد', 'یادداشت متنی ذخیره شد');
      navigation.goBack();
    }catch(e:any){ setBusy(false); Alert.alert('خطا', e?.message||''); }
  };

  return (
    <View style={{ flex:1, padding:12 }}>
      <Text style={{ fontWeight:'800', fontSize:18 }}>یادداشت جلسه</Text>
      <TextInput value={text} onChangeText={setText} placeholder="یادداشت متنی…" style={{ borderWidth:1, borderColor:'#eee', borderRadius:10, paddingHorizontal:10, minHeight:120, textAlignVertical:'top', marginTop:8 }} multiline />
      <View style={{ height:8 }} />
      <View style={{ flexDirection:'row', gap:8 }}>
        {!recording ? <TouchableOpacity onPress={start}><Text style={{ padding:10, borderRadius:8, backgroundColor:'#111', color:'#fff' }}>شروع ضبط</Text></TouchableOpacity> : <TouchableOpacity onPress={stop}><Text style={{ padding:10, borderRadius:8, backgroundColor:'#111', color:'#fff' }}>پایان ضبط</Text></TouchableOpacity>}
        <TouchableOpacity onPress={submitText}><Text style={{ padding:10, borderRadius:8, backgroundColor:'#f2f2f2' }}>ثبت متن</Text></TouchableOpacity>
      </View>
      {busy && <Text style={{ marginTop:8, opacity:.7 }}>در حال آپلود…</Text>}
    </View>
  );
}
