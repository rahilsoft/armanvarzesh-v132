import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { api } from '../../services/api';

export default function MonitoringScreen() {
  const [stats, setStats] = useState<any[]>([]);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await api.get('/monitoring/stats');
        setStats((res as any)?.data ?? res);
      } catch {
        setStats([]);
      }
    }
    fetchStats();
  }, []);

  return (
    <ScrollView>
      <View style={{ padding: 16 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>مانیتورینگ</Text>
        {stats.length === 0 && <Text>هیچ داده‌ای یافت نشد.</Text>}
        {stats.map((s: any, idx: number) => (
          <View key={idx} style={{ marginVertical: 8 }}>
            <Text>{s.name}: {s.value}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}