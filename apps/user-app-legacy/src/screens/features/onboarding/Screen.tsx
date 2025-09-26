import React, { useState } from 'react';
import { View, Text, ScrollView, Button } from 'react-native';
import { api } from '../../../services/api';

/**
 * Placeholder implementation of the smart onboarding page for the
 * mobile application.  This screen mirrors the functionality of
 * the dedicated feature component defined in
 * `src/features/onboarding/Screen.tsx` but lives under the
 * `screens/features` directory to satisfy the expected project
 * structure.  Users can select the type of service they require
 * and a list of recommended experts (or a single representative
 * from each category for the full package) will be fetched from
 * the matching endpoint.  Results are rendered using a simple
 * scrollable list.  In a production build this could be
 * enhanced with richer UI components and navigation hooks.
 */
export default function OnboardingScreen() {
  const [items, setItems] = useState<any[]>([]);
  const [selected, setSelected] = useState<string>('');

  async function fetchExperts(expertise: string) {
    setSelected(expertise);
    setItems([]);
    // Build query string; if the caller requests the full package we
    // omit the expertise parameter so that the backend can detect it
    // via the special "package" expertise.  The limit defaults to
    // three but is still included for clarity.
    const query = expertise && expertise !== 'package' ? `expertise=${expertise}&limit=3` : `expertise=package&limit=3`;
    try {
      const res = await api.get(`/matching/recommend?${query}`);
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