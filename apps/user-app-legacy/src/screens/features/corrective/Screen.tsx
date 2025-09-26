import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { api } from '../../../services/api';

/**
 * Placeholder wrapper for corrective exercise library in the
 * screens/features namespace.  This component duplicates the logic
 * from the corresponding feature screen so that navigation can
 * resolve this path without special handling.  It fetches the
 * exercises from the backend and renders them as a list.
 */
export default function CorrectiveScreen() {
  const [exercises, setExercises] = useState<any[]>([]);
  useEffect(() => {
    api
      .get('/corrective/exercises')
      .then((res) => {
        const data = (res as any)?.data ?? res;
        setExercises(Array.isArray(data) ? data : []);
      })
      .catch(() => setExercises([]));
  }, []);
  return (
    <ScrollView>
      <View style={{ padding: 16 }}>
        {exercises.length === 0 && (
          <Text style={{ marginBottom: 8 }}>هیچ حرکات اصلاحی وجود ندارد.</Text>
        )}
        {exercises.map((ex) => (
          <View key={ex.id} style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{ex.title}</Text>
            {ex.description && (
              <Text style={{ fontSize: 14, color: '#666' }}>{ex.description}</Text>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}