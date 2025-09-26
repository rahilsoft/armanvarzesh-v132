import React from 'react';
import { ScrollView, Text } from 'react-native';
import { useCart } from '../../../../packages/data/marketplace/hooks';
export default function OrdersScreen(){
  const { data, loading } = useCart();
  return (
    <ScrollView contentContainerStyle={{padding:16}}>
      <Text>سفارش‌ها (نمایشی — از cart)</Text>
      {loading? <Text>...</Text> : (data||[]).map(i=> <Text key={i.productId}>{i.productId} × {i.qty}</Text>)}
    </ScrollView>
  );
}
