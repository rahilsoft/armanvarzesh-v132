import React from 'react';
import { ScrollView, Text } from 'react-native';
import { useProducts } from '../../../../packages/data/marketplace/hooks';
export default function ManageProductsScreen(){
  const { data, loading } = useProducts();
  if(loading) return <Text>...</Text>;
  return (
    <ScrollView contentContainerStyle={{padding:16}}>
      {(data||[]).map(p=> <Text key={p.id}>{p.title} — {p.stock}</Text>)}
    </ScrollView>
  );
}
