
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';

const RegisterForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const handleRegister = () => {/* register logic here */};
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput style={styles.input} placeholder="Name" onChangeText={setName} value={name} />
      <TextInput style={styles.input} placeholder="Email" onChangeText={setEmail} value={email} autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry onChangeText={setPassword} value={password} />
      <Button title="Register" onPress={handleRegister} />
    </View>
  );
};
const styles = StyleSheet.create({ container: { padding: 16 }, input: { borderWidth: 1, marginVertical: 8, padding: 8 }, title: { fontSize: 20, marginBottom: 16 } });
export default RegisterForm;
