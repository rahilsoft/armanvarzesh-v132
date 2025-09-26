
import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { useQuery } from '@apollo/client';
import { EXERCISE_LIBRARY } from '@graphql/queries/plans.queries';

export default function ExerciseLibraryScreen({ route, navigation } : any){
  const onSelect = route.params?.onSelect as (ex:any)=>void;
  const [search, setSearch] = useState('');
  const { data, loading, fetchMore, refetch } = useQuery(EXERCISE_LIBRARY, { variables: { search, limit: 20 } });
  const edges = data?.exercises?.edges || [];
  const pageInfo = data?.exercises?.pageInfo;
  return (
    <View onTouchEnd={()=> navigation.navigate('ExercisePlayer', { id: item.id, title: item.title, url: item.videoUrl })} style={{ flex:1, padding:12 }}>
      <TextInput placeholder="جست‌وجوی حرکت…" value={search} onChangeText={setSearch} onSubmitEditing={()=> refetch({ search })}
        style={{ borderWidth:1, borderColor:'#eee', borderRadius:10, paddingHorizontal:12, height:40, marginBottom:8 }} />
      <FlatList data={edges} keyExtractor={(it)=> it.id} onEndReachedThreshold={0.4} onEndReached={()=>{
        if (pageInfo?.hasNextPage) fetchMore({ variables: { cursor: pageInfo.endCursor, limit: 20, search } });
      }} renderItem={({ item })=> (
        <TouchableOpacity onPress={()=> { if (onSelect) onSelect(item); navigation.goBack(); }} style={{ padding:12, borderBottomWidth:1, borderBottomColor:'#f5f5f5' }}>
          <Text style={{ fontWeight:'600' }}>{item.name || item.title}</Text>
          <View onTouchEnd={()=> navigation.navigate('ExercisePlayer', { id: item.id, title: item.title, url: item.videoUrl })} style={{ flexDirection:'row', alignItems:'center', gap:8 }}>
            {item.thumbnailUrl && <View onTouchEnd={()=> navigation.navigate('ExercisePlayer', { id: item.id, title: item.title, url: item.videoUrl })} style={{ width:72, height:40, backgroundColor:'#eee', borderRadius:6, overflow:'hidden', marginRight:8 }}><img src={item.thumbnailUrl} style={{ width:'100%', height:'100%' }} /></View>}
            <Text style={{ fontSize:12, color:'#666' }}>{[item.muscleGroup, item.equipment].filter(Boolean).join(' • ')}</Text>
            {!!item.durationSec && <Text style={{ fontSize:12, color:'#999' }}> ⏱ {Math.floor(item.durationSec/60)}:{String(item.durationSec%60).padStart(2,'0')}</Text>}
          </View>
        </TouchableOpacity>
      )} />
    </View>
  );
}
