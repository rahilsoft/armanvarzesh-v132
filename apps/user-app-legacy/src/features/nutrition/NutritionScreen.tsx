import React from 'react';
import { ScrollView, Text, TouchableOpacity } from 'react-native';
import { useMeals } from '../../../../packages/data/nutrition/hooks';
export default function NutritionScreen({ navigation }:any){
  const { data, loading } = useMeals();
  if(loading) return <Text>...</Text>;
  return (
    <ScrollView contentContainerStyle={{padding:16}}>
      {(data||[]).map(m=> <TouchableOpacity key={m.id} onPress={()=> navigation.navigate('MealPlan',{ id:m.id })}><Text>{m.title}</Text></TouchableOpacity>)}
    </ScrollView>
  );
}
