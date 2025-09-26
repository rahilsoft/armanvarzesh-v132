import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { api } from '../../services/api';

export default function AnalyticsScreen() {
  const [metrics, setMetrics] = useState<any[]>([]);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const res = await api.get('/analytics/metrics');
        setMetrics((res as any)?.data ?? res);
      } catch (err) {
        setMetrics([]);
      }
    }
    fetchMetrics();
  }, []);

  return (
    <ScrollView>
      <View style={{ padding: 16 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>آمار عملکرد</Text>
        {metrics.length === 0 && <Text>هیچ داده‌ای موجود نیست.</Text>}
        {metrics.map((m, index) => (
          <View key={index} style={{ marginVertical: 8 }}>
            <Text>{m.label}: {m.value}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}