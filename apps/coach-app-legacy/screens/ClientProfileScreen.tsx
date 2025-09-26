
import React, { useMemo, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, TextInput, Button, Alert } from 'react-native';
import { useMutation, useQuery } from '@apollo/client';
import { CLIENT_BY_ID, ADD_NOTE, CLIENT_NOTES, ARCHIVE_CLIENT } from '@graphql/queries/clients.queries';
import { gql, useQuery as useQ } from '@apollo/client';

function Badge({ text }:{ text:string }){
  return <View style={{ backgroundColor:'#eef5ff', paddingHorizontal:8, paddingVertical:4, borderRadius:100 }}><Text style={{color:'#2a6cfb'}}>{text}</Text></View>
}

export default function ClientProfileScreen({ route, navigation }: any){
  const id = route.params?.id;
  const { data, loading, refetch } = useQuery(CLIENT_BY_ID, { variables: { id } });
  const client = data?.client;
  const [tab, setTab] = useState<'overview'|'notes'|'plans'|'intake'>('overview');
  const [note, setNote] = useState('');
  const [addNote, { loading: savingNote }] = useMutation(ADD_NOTE, { refetchQueries: [{ query: CLIENT_BY_ID, variables: { id } }] });
  const [archive, { loading: archiving }] = useMutation(ARCHIVE_CLIENT, { variables: { id }, onCompleted:()=> { Alert.alert('بایگانی شد'); navigation.goBack(); } });

  if (loading) return <View style={{flex:1, alignItems:'center', justifyContent:'center'}}><Text>...</Text></View>;
  if (!client) return <View style={{flex:1, alignItems:'center', justifyContent:'center'}}><Text>یافت نشد</Text></View>;

  return (
    <View style={{flex:1}}>
      <ScrollView contentContainerStyle={{ padding:16 }}>
        <View style={{ flexDirection:'row', gap:12, alignItems:'center' }}>
          {client.avatar ? <Image source={{uri:client.avatar}} style={{ width:64, height:64, borderRadius:32 }} /> :
            <View style={{ width:64, height:64, borderRadius:32, backgroundColor:'#eee' }} />}
          <View style={{ flex:1 }}>
            <Text style={{ fontSize:18, fontWeight:'700' }}>{client.name}</Text>
            {!!client.email && <Text style={{ opacity:.7 }}>{client.email}</Text>}
            <View style={{ height:6 }} />
            {!!client.status && <Badge text={client.status} />}
          </View>
          <TouchableOpacity onPress={()=> archive()} disabled={archiving}><Text style={{ color:'#c00' }}>{archiving?'...':'بایگانی'}</Text></TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={{ flexDirection:'row', gap:8, marginTop:16 }}>
          {['overview','notes','plans','intake'].map(k=> (
            <TouchableOpacity key={k} onPress={()=> setTab(k as any)}>
              <Text style={{ paddingVertical:6, paddingHorizontal:10, borderRadius:100, backgroundColor: tab===k ? '#111' : '#f5f5f5', color: tab===k ? '#fff' : '#111' }}>
                {k==='overview'?'نمای کلی': k==='notes'?'یادداشت‌ها':'برنامه‌ها'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {tab==='overview' && (
          <View style={{ marginTop:16, gap:10 }}>
            <View style={{ flexDirection:'row', gap:12 }}>
              <Info label="قد" value={client.height ? client.height+' cm' : '—'} />
              <Info label="وزن" value={client.weight ? client.weight+' kg' : '—'} />
              <Info label="آخرین فعالیت" value={client.lastActiveAt ? new Date(client.lastActiveAt).toLocaleString() : '—'} />
            </View>
            <View>
              <Text style={{ fontWeight:'700', marginTop:8, marginBottom:4 }}>اهداف</Text>
              {(client.goals||[]).map((g:any)=> (
                <View key={g.id} style={{ padding:10, borderWidth:1, borderColor:'#eee', borderRadius:10, marginBottom:8 }}>
                  <Text style={{ fontWeight:'600' }}>{g.title}</Text>
                  {!!g.note && <Text style={{ opacity:.8, marginTop:4 }}>{g.note}</Text>}
                </View>
              ))}
              {(!client.goals || client.goals.length===0) && <Text style={{ opacity:.6 }}>هدفی ثبت نشده</Text>}
            </View>
            <View>
              <Text style={{ fontWeight:'700', marginTop:8, marginBottom:4 }}>متریک‌ها</Text>
              {(client.metrics||[]).slice(0,6).map((m:any,i:number)=> (
                <Text key={i} style={{ opacity:.8 }}>{new Date(m.date).toLocaleDateString()} — وزن: {m.weight||'—'} | چربی: {m.bodyFat||'—'}% | عضله: {m.muscleMass||'—'}</Text>
              ))}
              {(!client.metrics || client.metrics.length===0) && <Text style={{ opacity:.6 }}>داده‌ای ثبت نشده</Text>}
            </View>
          </View>
        )}

        {tab==='notes' && (
          <View style={{ marginTop:16 }}>
            <TextInput placeholder="یادداشت جدید…" value={note} onChangeText={setNote} multiline numberOfLines={3}
              style={{ borderWidth:1, borderColor:'#eee', borderRadius:10, padding:10, minHeight:80 }} />
            <View style={{ height:8 }} />
            <Button title={savingNote?'...':'افزودن یادداشت'} onPress={async ()=>{
              if (!note.trim()) return;
              await addNote({ variables: { clientId: id, body: note.trim() } });
              setNote(''); refetch();
            }} />
            <View style={{ height:12 }} />
            {(client.notes||[]).map((n:any)=> (
              <View key={n.id} style={{ padding:10, borderWidth:1, borderColor:'#eee', borderRadius:10, marginBottom:8 }}>
                <Text>{n.body}</Text>
                <Text style={{ opacity:.6, marginTop:4, fontSize:12 }}>{n.author?.name||'—'} • {new Date(n.createdAt).toLocaleString()}</Text>
              </View>
            ))}
            {(!client.notes || client.notes.length===0) && <Text style={{ opacity:.6 }}>یادداشتی ثبت نشده</Text>}
          </View>
        )}

        {tab==='plans' && (
          <View style={{ marginTop:16 }}>
            {(client.plans||[]).map((p:any)=> (
              <View key={p.id} style={{ padding:10, borderWidth:1, borderColor:'#eee', borderRadius:10, marginBottom:8 }}>
                <Text style={{ fontWeight:'700' }}>{p.title}</Text>
                <Text style={{ opacity:.8, marginTop:4 }}>{p.status||'—'} • {(p.startDate? new Date(p.startDate).toLocaleDateString(): '—')} → {(p.endDate? new Date(p.endDate).toLocaleDateString(): '—')}</Text>
              </View>
            ))}
            {(!client.plans || client.plans.length===0) && <Text style={{ opacity:.6 }}>برنامه‌ای تخصیص نشده</Text>}
          </View>
        )}

        {tab==='intake' && (
          <View style={{ marginTop:16, gap:8 }}>
            <IntakeProfile userId={id} />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function Info({ label, value }:{ label:string; value:string }){
  return (
    <View style={{ flex:1, padding:10, borderWidth:1, borderColor:'#eee', borderRadius:10 }}>
      <Text style={{ fontSize:12, color:'#666' }}>{label}</Text>
      <Text style={{ fontSize:16 }}>{value}</Text>
    </View>
  );
}


const Q_USER_PROFILE = gql`query($userId:String!){ userProfile(userId:$userId){ userId heightCm weightKg trainingEnv equipment injuries measurements medical } }`;
function IntakeProfile({ userId }:{ userId:string }){
  const { data, loading } = useQ(Q_USER_PROFILE, { variables: { userId } });
  const p = data?.userProfile;
  if (loading) return <Text>...</Text>;
  if (!p) return <Text style={{ opacity:.7 }}>پروفایل ثبت نشده</Text>;
  return (
    <View style={{ gap:8 }}>
      <Text style={{ fontWeight:'700' }}>پروفایل فیزیکی/تجهیزات</Text>
      <Text>قد: {p.heightCm||'—'} cm • وزن: {p.weightKg||'—'} kg</Text>
      <Text>محیط تمرین: {p.trainingEnv||'—'}</Text>
      <Text>تجهیزات: {(p.equipment||[]).join(', ')||'—'}</Text>
      {!!(p.injuries||[]).length && <Text>محدودیت‌ها: {(p.injuries||[]).join(', ')}</Text>}
    </View>
  );
}
