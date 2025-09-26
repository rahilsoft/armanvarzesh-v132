import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { api } from '../../services/api';

export default function PaymentsScreen() {
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    async function fetchPayments() {
      try {
        const res = await api.get('/payments/history');
        setTransactions((res as any)?.data ?? res);
      } catch {
        setTransactions([]);
      }
    }
    fetchPayments();
  }, []);

  return (
    <ScrollView>
      <View style={{ padding: 16 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>تراکنش‌ها</Text>
        {transactions.length === 0 && <Text>تراکنشی یافت نشد.</Text>}
        {transactions.map((t: any) => (
          <View key={t.id} style={{ marginVertical: 8 }}>
            <Text>مبلغ: {t.amount}</Text>
            <Text>تاریخ: {new Date(t.date).toLocaleDateString('fa-IR')}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}