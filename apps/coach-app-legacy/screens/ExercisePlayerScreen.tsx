
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Video } from 'expo-av';
import { gql, useMutation } from '@apollo/client';

const VIEW = gql`mutation($id:String!){ exerciseView(id:$id) }`;
const LIKE = gql`mutation($id:String!,$d:Int){ exerciseLike(id:$id, delta:$d) }`;

export default function ExercisePlayerScreen({ route } : any){
  const { id, title, url } = route.params || {};
  const ref = useRef<Video>(null);
  const [liked, setLiked] = useState(false);
  const [view] = useMutation(VIEW);
  const [like] = useMutation(LIKE);

  useEffect(()=>{ if (id) view({ variables:{ id } }).catch(()=>{}); }, [id]);

  const toggleLike = async ()=>{
    try{ await like({ variables: { id, d: liked? -1 : 1 } }); setLiked(!liked); }catch(e:any){ Alert.alert('خطا', e?.message||''); }
  };

  return (
    <View style={{ flex:1, padding:12 }}>
      <Text style={{ fontWeight:'800', fontSize:18 }}>{title||'ویدئو'}</Text>
      <Video ref={ref} source={{ uri: url }} style={{ width:'100%', aspectRatio:16/9, backgroundColor:'#000', borderRadius:12, marginTop:8 }} useNativeControls shouldPlay={false} resizeMode="contain" />
      <View style={{ flexDirection:'row', gap:8, marginTop:8 }}>
        <TouchableOpacity onPress={toggleLike}><Text style={{ padding:10, borderRadius:8, backgroundColor: liked? '#111':'#f2f2f2', color: liked? '#fff':'#111' }}>{liked? 'Liked ❤':'Like'}</Text></TouchableOpacity>
      </View>
    </View>
  );
}
