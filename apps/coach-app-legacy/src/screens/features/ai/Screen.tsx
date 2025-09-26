import React from 'react';
import { View, Text, ScrollView } from 'react-native';

export default function AiScreen() {
  return (
    <ScrollView contentContainerStyle={ padding: 16 }>
      <Text style={ fontSize: 18, fontWeight: '600' }>ai — coach-app</Text>
      <View style={ height: 12 } />
      <Text>Hook up real API endpoint for ai here.</Text>
    </ScrollView>
  );
}