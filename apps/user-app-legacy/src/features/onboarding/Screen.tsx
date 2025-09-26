import React, { useState } from 'react';
import { View, Text, ScrollView, Button } from 'react-native';
import { api } from '../../services/api';

/**
 * Smart onboarding screen for mobile clients.  Users select which
 * service they require and the component fetches an appropriate set
 * of experts from the matching endpoint.  The results are displayed
 * below the selection buttons.  If the user selects the full
 * package, one expert from each category will be returned.  A simple
 * list is used to render the recommendations; production code would
 * likely include richer UI elements.
 */
export default function OnboardingScreen() {
  const [items, setItems] = useState<any[]>([]);
  const [selected, setSelected] = useState<string>('');

  async function fetchExperts(expertise: string) {
    setSelected(expertise);
    setItems([]);
    const query = expertise ? `expertise=${expertise}` : '';
    try {
      const res = await api.get(`/matching/recommend?${query}&limit=3`);
      const data = (res as any)?.data ?? res;
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setItems([]);
    }
  }

  return (
    <ScrollView>
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 12 }}>
          انتخاب نوع خدمات
        </Text>
        <View style={{ marginBottom: 8 }}>
          <Button title="برنامه تمرینی" onPress={() => fetchExperts('trainer')} />
        </View>
        <View style={{ marginBottom: 8 }}>
          <Button title="برنامه غذایی" onPress={() => fetchExperts('nutrition')} />
        </View>
        <View style={{ marginBottom: 8 }}>
          <Button title="حرکات اصلاحی" onPress={() => fetchExperts('physio')} />
        </View>
        <View style={{ marginBottom: 16 }}>
          <Button title="پکیج کامل" onPress={() => fetchExperts('package')} />
        </View>
        {selected && (
          <Text style={{ fontSize: 16, marginBottom: 8 }}>
            نتایج برای: {selected === 'package' ? 'پکیج کامل' : selected}
          </Text>
        )}
        {items.length === 0 && selected && (
          <Text style={{ marginBottom: 8 }}>هیچ متخصصی یافت نشد.</Text>
        )}
        {items.map((item) => (
          <View key={item.id} style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.name}</Text>
            <Text style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>
              {item.expertise}
            </Text>
            {/* Provide a call to action to initiate a chat before
            committing to a programme.  In a full implementation
            this would navigate to a dedicated chat screen or
            initiate a session via the chat service.  For now we
            display a simple alert. */}
            <Button
              title="شروع گفتگو"
              onPress={() => {
                // eslint-disable-next-line no-alert
                alert(`شروع گفتگو با ${item.name}`);
              }}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}