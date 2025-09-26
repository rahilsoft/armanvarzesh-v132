import React, { useMemo, useState } from 'react';
import { formatCurrency } from '@arman/utils';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { createPayment } from '../services/payments';

export default function PaymentScreen() {
  const [amount, setAmount] = useState('10000');
  const [currency, setCurrency] = useState('IRR');
  const onPay = async () => {
    try {
      const controller = new AbortController();
      const res = await createPayment(parseInt(amount, 10), currency, controller.signal);
      Alert.alert('Payment', JSON.stringify(res));
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Failed');
    }
  };
  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 8 }}>Checkout</Text>
      <Text>Amount (cents)</Text>
      <TextInput value={amount} onChangeText={setAmount} keyboardType="numeric" style={{ borderWidth: 1, padding: 8, marginBottom: 8 }} />
      <Text>Currency</Text>
      <TextInput value={currency} onChangeText={setCurrency} autoCapitalize="characters" style={{ borderWidth: 1, padding: 8, marginBottom: 8 }} />
      {/* Preview formatted */}
      <Text style={{ marginBottom: 8 }}>{formatCurrency(parseInt(amount||'0',10), currency)}</Text>
      <Button title="Pay" onPress={onPay} />
    </View>
  );
}
