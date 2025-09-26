
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function NoteItem({ body, author, createdAt }:{ body:string; author?:{name?:string}; createdAt:string }){
  const d = new Date(createdAt).toLocaleString();
  return (
    <View style={s.box}>
      <Text style={s.body}>{body}</Text>
      <Text style={s.meta}>{author?.name || '—'} • {d}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  box:{ padding:12, borderWidth:1, borderColor:'#eee', borderRadius:10, backgroundColor:'#fff' },
  body:{ fontSize:14, lineHeight:20 },
  meta:{ fontSize:11, color:'#888', marginTop:8 }
});
