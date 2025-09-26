import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { api } from '../../services/api';

export default function AssessmentsScreen() {
  const [assessments, setAssessments] = useState<any[]>([]);

  useEffect(() => {
    async function fetchAssessments() {
      try {
        const res = await api.get('/assessments');
        setAssessments((res as any)?.data ?? res);
      } catch (err) {
        setAssessments([]);
      }
    }
    fetchAssessments();
  }, []);

  return (
    <ScrollView>
      <View style={{ padding: 16 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>آزمون‌ها</Text>
        {assessments.length === 0 && <Text>هیچ آزمونی موجود نیست.</Text>}
        {assessments.map((assessment) => (
          <View key={assessment.id} style={{ marginVertical: 8 }}>
            <Text>{assessment.title}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}