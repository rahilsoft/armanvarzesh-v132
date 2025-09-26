import React from 'react';
import { ScrollView, Text, TouchableOpacity } from 'react-native';
import { useWorkouts } from '../../../../packages/data/workouts/hooks';
export default function WorkoutsListScreen({ navigation }:any){
  const { data, loading } = useWorkouts();
  if(loading) return <Text>...</Text>;
  return (
    <ScrollView contentContainerStyle={{padding:16}}>
      {(data||[]).map(w=> <TouchableOpacity key={w.id} onPress={()=> navigation.navigate('WorkoutDetail',{ id:w.id })}><Text>{w.title}</Text></TouchableOpacity>)}
    </ScrollView>
  );
}
