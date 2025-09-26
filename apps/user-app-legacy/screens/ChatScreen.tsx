import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, FlatList, TextInput, Pressable, Image } from 'react-native';
import { Video } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { useQuery, useMutation, useSubscription } from '@apollo/client';
import { GET_CHAT } from '../graphql/queries/chat.queries';
import { SEND_MESSAGE, SEND_ATTACHMENT } from '../graphql/mutations/chat.mutations';
import { MESSAGE_RECEIVED } from '../graphql/subscriptions/chat.subs';
import { uploadWithSignedUrl } from '../utils/signed-upload';

const ME = 1; // TODO: inject from auth
const PEER = 10; // TODO: selected peer

export default function ChatScreen() {
  const apiBase = process.env.EXPO_PUBLIC_GRAPHQL_HTTP?.replace('/graphql','') || 'http://localhost:4000';
  const { data, refetch } = useQuery(GET_CHAT, { variables: { userA: ME, userB: PEER } });
  const { data: sdata } = useSubscription(MESSAGE_RECEIVED, { variables: { userId: ME } });
  const [sendMessage] = useMutation(SEND_MESSAGE);
  const [sendAttachment] = useMutation(SEND_ATTACHMENT);
  const [text, setText] = useState('');
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => { setItems(data?.getChat || []); }, [data]);
  useEffect(() => {
    const m = sdata?.messageReceived;
    if (m && ((m.senderId===PEER && m.receiverId===ME) || (m.senderId===ME && m.receiverId===PEER))) {
      setItems(prev => [m, ...prev]);
    }
  }, [sdata]);

  const onSend = async () => {
    if (!text.trim()) return;
    await sendMessage({ variables: { input: { senderId: ME, receiverId: PEER, content: text } } });
    setText('');
    refetch();
  };

  const onAttach = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.All, quality: 0.9 });
    if (res.canceled || !res.assets?.length) return;
    const asset = res.assets[0];
    const uri = asset.uri;
    const contentType = asset.type === 'video' ? 'video/mp4' : 'image/webp';
    const key = `chat/${ME}-${PEER}-${Date.now()}.${asset.type==='video'?'mp4':'webp'}`;
    // read file
    const file = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
    const bin = Uint8Array.from(atob(file), c => c.charCodeAt(0));
    await uploadWithSignedUrl(apiBase, key, contentType, bin);
    await sendAttachment({ variables: { input: { senderId: ME, receiverId: PEER, key, contentType } } });
    refetch();
  };

  const render = ({ item }: any) => (
    <View style={{ alignSelf: item.senderId===ME ? 'flex-end':'flex-start', maxWidth:'80%', borderWidth:1, borderColor:'#eee', borderRadius:12, padding:8, marginBottom:8 }}>
      {item.attachmentId && item.attachmentUrl ? (
                item.attachmentType?.startsWith('video') ? (
                  <View>
                    <Text style={{fontSize:12,opacity:.6}}>🎞 ویدیو</Text>
                    <Video
                      source={{ uri: item.attachmentUrl }}
                      useNativeControls
                      resizeMode="contain"
                      style={{ width: 240, height: 160, borderRadius: 8, backgroundColor:'#000' }}
                    />
                  </View>
                ) : (
                  <Image source={{ uri: item.attachmentUrl }} style={{ width: 240, height: 160, borderRadius: 8 }} />
                )
              ) : null}
              {item.content ? <Text>{item.content}</Text> : null}
    </View>
  );

  return (
    <View style={{ flex:1, padding:16 }}>
      <FlatList
        inverted
        data={items}
        keyExtractor={x=>String(x.id)}
        renderItem={render}
      />
      <View style={{ flexDirection:'row', gap:8, marginTop:8 }}>
        <Pressable onPress={onAttach}><Text style={{padding:12, borderWidth:1, borderColor:'#ddd', borderRadius:8}}>📎</Text></Pressable>
        <TextInput value={text} onChangeText={setText} placeholder="پیام..." style={{ flex:1, borderWidth:1, borderColor:'#ddd', borderRadius:8, padding:12 }}/>
        <Pressable onPress={onSend}><Text style={{padding:12, backgroundColor:'#111', color:'#fff', borderRadius:8}}>ارسال</Text></Pressable>
      </View>
    </View>
  );
}
