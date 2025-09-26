
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

export type ClientEdge = { id:string; name:string; email?:string; avatar?:string; status?:string; lastActiveAt?:string };

export default function ClientListItem({ item, onPress }: { item: ClientEdge; onPress: (id:string)=>void }){
  const initials = (item.name||'?').split(' ').map(x=>x[0]).slice(0,2).join('').toUpperCase();
  return (
    <TouchableOpacity onPress={()=> onPress(item.id)} style={s.row}>
      {item.avatar ? (<Image source={{ uri: item.avatar }} style={s.avatar} />) : (
        <View style={[s.avatar, s.ph]}><Text style={{color:'#555'}}>{initials}</Text></View>
      )}
      <View style={{flex:1}}>
        <Text style={s.name}>{item.name}</Text>
        {!!item.email && <Text style={s.sub}>{item.email}</Text>}
      </View>
      {!!item.status && <View style={s.badge}><Text style={s.badgeText}>{item.status}</Text></View>}
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  row:{ flexDirection:'row', alignItems:'center', paddingVertical:12, gap:12, borderBottomWidth:1, borderBottomColor:'#f0f0f0' },
  avatar:{ width:44, height:44, borderRadius:22, backgroundColor:'#eee', alignItems:'center', justifyContent:'center' },
  ph:{ backgroundColor:'#f4f4f4' },
  name:{ fontSize:16, fontWeight:'600' },
  sub:{ fontSize:12, color:'#666' },
  badge:{ backgroundColor:'#eef5ff', paddingVertical:4, paddingHorizontal:8, borderRadius:100 },
  badgeText:{ color:'#2a6cfb', fontSize:12 }
});
