import React from 'react';
import { View, Text, ScrollView } from 'react-native';

export default function AssessmentsScreen() {
  return (
    <ScrollView contentContainerStyle={ padding: 16 }>
      <Text style={ fontSize: 18, fontWeight: '600' }>assessments — user-app</Text>
      <View style={ height: 12 } />
      <Text>Hook up real API endpoint for assessments here.</Text>
    </ScrollView>
  );
}