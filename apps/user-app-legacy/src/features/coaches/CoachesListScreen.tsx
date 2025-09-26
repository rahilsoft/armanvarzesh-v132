import React from 'react';
import { ScrollView, Text, TouchableOpacity } from 'react-native';
import { useCoaches } from '../../../../packages/data/coaches/hooks';
export default function CoachesListScreen({ navigation }:any){
  const { data, loading } = useCoaches({});
  if(loading) return <Text>...</Text>;
  return (
    <ScrollView contentContainerStyle={{padding:16}}>
      {(data||[]).map(c=> <TouchableOpacity key={c.id} onPress={()=> navigation.navigate('CoachProfile',{ id:c.id })}>
        <Text>{c.name} — ⭐ {c.rating}</Text>
      </TouchableOpacity>)}
    </ScrollView>
  );
}
