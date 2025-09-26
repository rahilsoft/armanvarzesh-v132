import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { api } from '../../services/api';

export default function VipScreen() {
  const [membership, setMembership] = useState<any>(null);

  useEffect(() => {
    async function fetchVip() {
      try {
        const res = await api.get('/vip/membership');
        setMembership((res as any)?.data ?? res);
      } catch {
        setMembership(null);
      }
    }
    fetchVip();
  }, []);

  return (
    <ScrollView>
      <View style={{ padding: 16 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>عضویت VIP</Text>
        {!membership && <Text>در حال حاضر عضو VIP نیستید.</Text>}
        {membership && (
          <View>
            <Text>سطح: {membership.level}</Text>
            <Text>امتیاز: {membership.points}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}