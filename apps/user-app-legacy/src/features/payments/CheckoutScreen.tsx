import React from 'react';
import { ScrollView, Text, Button } from 'react-native';
import { useCreateIntent, useConfirmPayment, useTokenizeCard } from '../../../../packages/data/payments/hooks';
export default function CheckoutScreen(){
  const { mutate: create, loading: creating } = useCreateIntent();
  const { mutate: confirm, loading: confirming } = useConfirmPayment();
  const { mutate: tokenize, loading: tokenizing } = useTokenizeCard();
  async function pay(){
    const pi = await create({ amount: 199000, currency:'IRT' });
    const token = await tokenize('4242424242424242','12/27','123');
    const res = await confirm(pi.id, token);
    alert(res.status==='succeeded' ? 'پرداخت موفق' : 'پرداخت ناموفق');
  }
  return (
    <ScrollView contentContainerStyle={{padding:16}}>
      <Text>تسویه</Text>
      <Button title={creating||confirming||tokenizing? '...' : 'پرداخت کن'} onPress={pay} />
    </ScrollView>
  );
}
