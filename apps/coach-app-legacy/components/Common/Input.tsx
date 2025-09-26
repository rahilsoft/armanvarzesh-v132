
import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

const Input = props => <TextInput style={styles.input} {...props} />;
const styles = StyleSheet.create({ input: { borderWidth: 1, borderColor: '#bbb', borderRadius: 5, padding: 8, marginVertical: 6 } });
export default Input;
