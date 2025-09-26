
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { useMutation } from '@apollo/client';
import { LOGIN_COACH } from '@graphql/queries/auth.queries';
import useAuth from '@hooks/useAuth';

export default function LoginForm(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>('');
  const [loginMutation, { loading }] = useMutation(LOGIN_COACH);
  const { login } = useAuth();

  const validate = ()=>{
    if (!email.includes('@')) return 'ایمیل نامعتبر است';
    if (!password || password.length < 6) return 'رمز عبور حداقل ۶ کاراکتر';
    return '';
  };

  const handleLogin = async () => {
    const v = validate(); if (v){ setError(v); return; }
    setError('');
    try{
      const { data } = await loginMutation({ variables: { email, password } });
      const token = data?.login?.token;
      const coach = data?.login?.coach;
      if (!token || !coach) throw new Error('پاسخ نامعتبر از سرور');
      await login(coach, token);
    }catch(e:any){
      setError(e?.message || 'خطا در ورود');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ورود مربی</Text>
      {!!error && <Text style={styles.error}>{error}</Text>}
      <TextInput style={styles.input} placeholder="ایمیل" onChangeText={setEmail} value={email} autoCapitalize="none" keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="رمز عبور" secureTextEntry onChangeText={setPassword} value={password} />
      <Button title={loading ? '...' : 'ورود'} onPress={handleLogin} disabled={loading} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: { padding: 16 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, marginBottom: 10 },
  title: { fontSize: 20, marginBottom: 16, textAlign: 'center' },
  error: { color: 'crimson', marginBottom: 8, textAlign: 'center' }
});
