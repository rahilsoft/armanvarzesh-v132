import React from 'react';
import { ScrollView, Text, Button, TextInput, View } from 'react-native';
import { useCart, useCartOps } from '../../../../packages/data/cart/hooks';
export default function CartScreen({ navigation }:any){
  const { data, loading, reload } = useCart();
  const { setQty, clear, loading: working } = useCartOps();
  if(loading) return <Text>...</Text>;
  return (
    <ScrollView contentContainerStyle={{padding:16}}>
      {(data?.items||[]).map((it:any)=> <View key={it.productId} style={{flexDirection:'row', gap:8, alignItems:'center'}}>
        <Text style={{flex:1}}>{it.title}</Text>
        <Text>{it.price}</Text>
        <TextInput keyboardType="numeric" style={{borderWidth:1, minWidth:48}} value={String(it.qty)} onChangeText={async(t)=>{ await setQty(it.productId, Number(t||0)); await reload(); }} />
      </View>)}
      <Text>جمع: {data?.subtotal}</Text>
      <Button title={working? '...' : 'خالی کردن'} onPress={async()=>{ await clear(); await reload(); }} />
      <Button title="تسویه" onPress={()=> navigation.navigate('Checkout')} />
    </ScrollView>
  );
}
