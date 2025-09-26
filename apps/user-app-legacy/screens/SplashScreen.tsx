
import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

const SplashScreen = () => (
  <View style={styles.container}>
    <ActivityIndicator size="large" />
    <Text style={styles.text}>Loading ArmanFit...</Text>
  </View>
);
const styles = StyleSheet.create({ container: { flex: 1, alignItems: 'center', justifyContent: 'center' }, text: { marginTop: 16, fontSize: 18 } });
export default SplashScreen;
