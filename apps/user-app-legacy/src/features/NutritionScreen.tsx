import React from 'react';
import { View, Text, FlatList } from 'react-native';

export default function NutritionScreen() {
  const [items] = React.useState([{ id:'1', title:'Meal logging placeholder'}]);
  return (
    <View style={{ flex:1, padding:16 }}>
      <Text style={{ fontSize:18, fontWeight:'600' }}>Nutrition</Text>
      <FlatList data={items} keyExtractor={i=>i.id} renderItem={({item}) => <Text>{item.title}</Text>} />
    </View>
  );
}
