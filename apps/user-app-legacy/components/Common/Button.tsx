
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const Button = ({ title, onPress }) => (
  <TouchableOpacity style={styles.btn} onPress={onPress}>
    <Text style={styles.text}>{title}</Text>
  </TouchableOpacity>
);
const styles = StyleSheet.create({ btn: { backgroundColor: '#2644fc', borderRadius: 6, padding: 12, margin: 8 }, text: { color: '#fff', fontWeight: 'bold', fontSize: 16, textAlign: 'center' } });
export default Button;
