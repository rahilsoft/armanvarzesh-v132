
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert, ScrollView } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { gql, useMutation, useQuery } from '@apollo/client';

const UPSERT = gql`mutation($input:UpsertExerciseInput!){ upsertExercise(input:$input){ id } }`;
const REQ = gql`mutation($kind:String!,$ext:String!){ requestUploadUrl(kind:$kind, ext:$ext){ url } }`;
const MPU = gql`mutation($kind:String!,$ext:String!){ createMultipartUpload(kind:$kind, ext:$ext){ uploadId key } }`;
const SIGN = gql`mutation($key:String!,$uploadId:String!,$partNumber:Int!){ signUploadPart(key:$key, uploadId:$uploadId, partNumber:$partNumber){ url } }`;
const DONE = gql`mutation($key:String!,$uploadId:String!,$parts:String!){ completeMultipartUpload(key:$key, uploadId:$uploadId, parts:$parts){ url } }`;
const TAX = gql`query{ sports{ id name } equipmentCatalogs{ id name } muscles{ id code name } }`;

export default function MyLibraryUploadScreen({ route } : any){
  const coachId = route?.params?.coachId || 'demo-coach';
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [level, setLevel] = useState('beginner');
  const [kind, setKind] = useState('MAIN');
  const [videoUrl, setVideoUrl] = useState('');
  const [selSports, setSelSports] = useState<string[]>([]);
  const [selEquip, setSelEquip] = useState<string[]>([]);
  const [selPrim, setSelPrim] = useState<string[]>([]);
  const [selSec, setSelSec] = useState<string[]>([]);
  const [progress, setProgress] = useState<number>(0);
  const [upsert] = useMutation(UPSERT);
  const uploadMultipart = async (uri:string, ext:string)=>{
    const init = await mpu({ variables: { kind:'video', ext } });
    const { uploadId, key } = init.data.createMultipartUpload;
    const stat:any = await FileSystem.getInfoAsync(uri, { size:true });
    const partSize = 8 * 1024 * 1024; // 8MB
    const fileSize = stat.size || 0;
    const partCount = Math.max(1, Math.ceil(fileSize / partSize));
    const parts:any[] = [];
    for (let i=0;i<partCount;i++){
      const from = i*partSize;
      const to = Math.min(fileSize, (i+1)*partSize);
      const partNum = i+1;
      const r = await sign({ variables: { key, uploadId, partNumber: partNum } });
      const url = r.data.signUploadPart.url;
      // NOTE: expo-file-system cannot slice; as a stub, we fallback to fetch with 'Range' unsupported in PUT in many envs.
      // Practical approach: read whole file for each part is not feasible; in production use native slicing.
      // Here we do single PUT when partCount===1 for safety:
      if (partCount===1){
        const up = await FileSystem.uploadAsync(url, uri, { httpMethod:'PUT', uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT, headers: { 'Content-Type': `video/${ext}` } });
        const etag = (up.headers['ETag'] || up.headers['etag'] || '').replaceAll('"','');
        parts.push({ ETag: etag, PartNumber: partNum });
        setProgress(100);
      } else {
        throw new Error('Multipart slicing نیاز به ماژول نیتیو دارد (stub). فعلاً فایل بزرگ را با PUT تکی آپلود کنید یا اندازه را کاهش دهید.');
      }
    }
    const r2 = await done({ variables: { key, uploadId, parts: JSON.stringify(parts) } });
    return r2.data.completeMultipartUpload.url;
  };

  const [req] = useMutation(REQ);
  const [mpu] = useMutation(MPU);
  const [sign] = useMutation(SIGN);
  const [done] = useMutation(DONE);
  const { data } = useQuery(TAX);

  const pick = async ()=>{
    const res = await DocumentPicker.getDocumentAsync({ type: 'video/*' });
    if (res.canceled) return;
    const f = res.assets?.[0]; if (!f) return;
    const ext = (f.name?.split('.').pop() || 'mp4').toLowerCase();
    try{
      const stat:any = await FileSystem.getInfoAsync(f.uri, { size:true });
      if ((stat.size||0) > 45*1024*1024){
        try{ const url = await uploadMultipart(f.uri, ext); setVideoUrl(url); Alert.alert('آپلود شد (Multipart)', 'ویدئو در فضای ابری ذخیره شد.'); setProgress(100); }
        catch(e:any){ Alert.alert('Multipart خطا', e?.message||''); }
      } else {
        const r = await req({ variables: { kind:'video', ext } });
        const payload = JSON.parse(r.data.requestUploadUrl.url);
        const task = FileSystem.createUploadTask(payload.uploadUrl, f.uri, { httpMethod:'PUT', uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT, headers: { 'Content-Type': `video/${ext}` } }, (data)=>{ try{ setProgress(Math.round((data.totalBytesSent / data.totalBytesExpectedToSend) * 100)); }catch(e){} });
        const up = await task.uploadAsync();
        if (up.status >= 200 && up.status < 300){ setVideoUrl(payload.fileUrl); Alert.alert('آپلود شد', 'ویدئو در فضای ابری ذخیره شد.'); } else { Alert.alert('خطا', 'آپلود نشد'); }
      }
    }catch(e:any){ Alert.alert('خطا', e?.message || 'نشد'); }
  };

  const submit = async ()=>{
    if (!videoUrl || !title) { Alert.alert('لطفاً عنوان و ویدئو را تکمیل کنید.'); return; }
    await upsert({ variables: { input: { title, description: desc, level, kind, videoUrl, ownerId: coachId, sports: selSports, equipment: selEquip, primaryMuscles: selPrim, secondaryMuscles: selSec } } });
    Alert.alert('ثبت شد', 'ویدئو برای تأیید ارسال شد.');
    setTitle(''); setDesc(''); setVideoUrl(''); setSelSports([]); setSelEquip([]); setSelPrim([]); setSelSec([]);
  };

  return (
    <ScrollView contentContainerStyle={{ padding:12, gap:10 }}>
      <Text style={{ fontWeight:'700', fontSize:18 }}>کتابخانهٔ خصوصی مربی — آپلود ویدئو</Text>
      <TextInput placeholder="عنوان ویدئو" value={title} onChangeText={setTitle} style={{ borderWidth:1, borderColor:'#eee', borderRadius:10, paddingHorizontal:10, height:42 }} />
      <TextInput placeholder="توضیح" value={desc} onChangeText={setDesc} style={{ borderWidth:1, borderColor:'#eee', borderRadius:10, paddingHorizontal:10, height:90, textAlignVertical:'top' }} multiline />
      <Button title="انتخاب ویدئو و آپلود" onPress={pick} />
      {progress>0 && progress<100 ? <Text style={{ marginTop:8 }}>در حال آپلود: {progress}%</Text> : null
      }
      {!!videoUrl && <Text style={{ color:'#1f8f4f' }}>{videoUrl}</Text>}}
      <Text style={{ marginTop:12, fontWeight:'700' }}>دسته‌بندی</Text>
      <Text style={{ opacity:.7 }}>رشته‌ها</Text>
      <View style={{ flexDirection:'row', flexWrap:'wrap' }}>
        {(data?.sports||[]).map((s:any)=> <Text key={s.id} onPress={()=> setSelSports(selSports.includes(s.id)? selSports.filter(x=>x!==s.id): [...selSports,s.id])} style={{ margin:4, padding:6, borderWidth:1, borderColor:'#eee', borderRadius:100, backgroundColor: selSports.includes(s.id)? '#111':'#fff', color: selSports.includes(s.id)? '#fff':'#111' }}>{s.name}</Text>)}
      </View>
      <Text style={{ opacity:.7 }}>تجهیزات</Text>
      <View style={{ flexDirection:'row', flexWrap:'wrap' }}>
        {(data?.equipmentCatalogs||[]).map((e:any)=> <Text key={e.id} onPress={()=> setSelEquip(selEquip.includes(e.id)? selEquip.filter(x=>x!==e.id): [...selEquip,e.id])} style={{ margin:4, padding:6, borderWidth:1, borderColor:'#eee', borderRadius:100, backgroundColor: selEquip.includes(e.id)? '#111':'#fff', color: selEquip.includes(e.id)? '#fff':'#111' }}>{e.name}</Text>)}
      </View>
      <Text style={{ opacity:.7 }}>عضلات اصلی</Text>
      <View style={{ flexDirection:'row', flexWrap:'wrap' }}>
        {(data?.muscles||[]).map((m:any)=> <Text key={m.id} onPress={()=> setSelPrim(selPrim.includes(m.id)? selPrim.filter(x=>x!==m.id): [...selPrim,m.id])} style={{ margin:4, padding:6, borderWidth:1, borderColor:'#eee', borderRadius:100, backgroundColor: selPrim.includes(m.id)? '#111':'#fff', color: selPrim.includes(m.id)? '#fff':'#111' }}>{m.code}</Text>)}
      </View>
      <Text style={{ opacity:.7 }}>عضلات فرعی</Text>
      <View style={{ flexDirection:'row', flexWrap:'wrap' }}>
        {(data?.muscles||[]).map((m:any)=> <Text key={m.id} onPress={()=> setSelSec(selSec.includes(m.id)? selSec.filter(x=>x!==m.id): [...selSec,m.id])} style={{ margin:4, padding:6, borderWidth:1, borderColor:'#eee', borderRadius:100, backgroundColor: selSec.includes(m.id)? '#111':'#fff', color: selSec.includes(m.id)? '#fff':'#111' }}>{m.code}</Text>)}
      </View>
      <Button title="ارسال برای تأیید" onPress={submit} />
    </ScrollView>
  );
}
