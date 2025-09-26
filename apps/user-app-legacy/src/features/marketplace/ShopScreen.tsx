import React from 'react';
import { ScrollView, Text, Button } from 'react-native';
import { useProducts } from '../../../../packages/data/marketplace/hooks';
import { useCartOps } from '../../../../packages/data/cart/hooks';
export default function ShopScreen({ navigation }:any){
  const { data, loading } = useProducts();
  const { add } = useCartOps();
  if(loading) return <Text>...</Text>;
  return (
    <ScrollView contentContainerStyle={{padding:16}}>
      {(data||[]).map(p=> <React.Fragment key={p.id}>
        <Text>{p.title} — {p.price}</Text>
        <Button title="افزودن" onPress={()=> add({ productId:p.id, qty:1, price:p.price, title:p.title, currency:p.currency as any })} />
      </React.Fragment>)}
      <Button title="مشاهده سبد" onPress={()=> navigation.navigate('Cart')} />
    </ScrollView>
  );
}
