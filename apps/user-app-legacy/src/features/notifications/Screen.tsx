import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { api } from '../../services/api';

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const res = await api.get('/notifications');
        setNotifications((res as any)?.data ?? res);
      } catch {
        setNotifications([]);
      }
    }
    fetchNotifications();
  }, []);

  return (
    <ScrollView>
      <View style={{ padding: 16 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>اعلان‌ها</Text>
        {notifications.length === 0 && <Text>هیچ اعلانی وجود ندارد.</Text>}
        {notifications.map((n: any) => (
          <View key={n.id} style={{ marginVertical: 8 }}>
            <Text>{n.title}</Text>
            <Text>{n.body}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}