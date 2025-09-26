import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { api } from '../../services/api';

/**
 * Mobile screen that lists corrective exercises available in the
 * library.  Utilises the REST endpoint provided by the backend
 * CorrectiveModule to retrieve all exercises.  The list is
 * rendered as simple text for each exercise.  Future work could
 * incorporate rich media or allow filtering by body part or
 * condition.
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