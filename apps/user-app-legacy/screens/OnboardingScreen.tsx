
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const OnboardingScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Welcome to ArmanFit!</Text>
    <Text style={styles.text}>Your journey to fitness starts here.</Text>
  </View>
);
const styles = StyleSheet.create({ container: { flex: 1, alignItems: 'center', justifyContent: 'center' }, title: { fontWeight: 'bold', fontSize: 22 }, text: { fontSize: 16, marginTop: 8 } });
export default OnboardingScreen;
