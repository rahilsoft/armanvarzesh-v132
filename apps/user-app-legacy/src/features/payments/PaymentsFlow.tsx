import React, { useState } from 'react';
import { View, Text, Button, TextInput, Linking } from 'react-native';
import { checkout, mySubscription } from './api';

export default function PaymentsFlow(){
  const [productId, setProductId] = useState('plan-pro');
  const [out, setOut] = useState<any>(null);

  const onCheckout = async ()=>{
    const res = await checkout(productId);
    setOut(res);
    if (res.checkoutUrl) Linking.openURL(res.checkoutUrl);
  };
  const onRefreshEntitlements = async ()=>{
    const res = await mySubscription();
    setOut(res);
  };

  return <View style={{ padding:16 }}>
    <Text style={{ fontSize:18, fontWeight:'700' }}>Payments</Text>
    <TextInput value={productId} onChangeText={setProductId} style={{ borderWidth:1, padding:8, marginVertical:6 }} placeholder="productId" />
    <Button title="Checkout" onPress={onCheckout} />
    <Button title="Refresh Entitlements" onPress={onRefreshEntitlements} />
    <Text selectable>{JSON.stringify(out, null, 2)}</Text>
  </View>;
}
