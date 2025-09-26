import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { api } from '../../services/api';

export default function RewardsScreen() {
  const [rewards, setRewards] = useState<any[]>([]);

  useEffect(() => {
    async function fetchRewards() {
      try {
        const res = await api.get('/rewards');
        setRewards((res as any)?.data ?? res);
      } catch {
        setRewards([]);
      }
    }
    fetchRewards();
  }, []);

  return (
    <ScrollView>
      <View style={{ padding: 16 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>جوایز</Text>
        {rewards.length === 0 && <Text>هیچ جایزه‌ای موجود نیست.</Text>}
        {rewards.map((r: any) => (
          <View key={r.id} style={{ marginVertical: 8 }}>
            <Text>{r.title} – {r.points} امتیاز</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}