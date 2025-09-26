
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { useMutation } from '@apollo/client';
import { REGISTER_COACH } from '@graphql/queries/auth.queries';
import useAuth from '@hooks/useAuth';

export default function RegisterForm(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string>('');
  const [mutate, { loading }] = useMutation(REGISTER_COACH);
  const { login } = useAuth();

  const validate = ()=>{
    if (!name || name.length < 2) return 'نام معتبر نیست';
    if (!email.includes('@')) return 'ایمیل نامعتبر است';
    if (!password || password.length < 6) return 'رمز عبور حداقل ۶ کاراکتر';
    return '';
  };

  const handleRegister = async () => {
    const v = validate(); if (v){ setError(v); return; }
    setError('');
    try{
      const { data } = await mutate({ variables: { input: { email, password, name, role: 'COACH' } } });
      const token = data?.register?.token;
      const coach = data?.register?.coach;
      if (!token || !coach) throw new Error('پاسخ نامعتبر از سرور');
      await login(coach, token);
    }catch(e:any){
      setError(e?.message || 'خطا در ثبت‌نام');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ثبت‌نام مربی</Text>
      {!!error && <Text style={styles.error}>{error}</Text>}
      <TextInput style={styles.input} placeholder="نام" onChangeText={setName} value={name} />
      <TextInput style={styles.input} placeholder="ایمیل" onChangeText={setEmail} value={email} autoCapitalize="none" keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="رمز عبور" secureTextEntry onChangeText={setPassword} value={password} />
      <Button title={loading ? '...' : 'ثبت‌نام و ورود'} onPress={handleRegister} disabled={loading} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: { padding: 16 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, marginBottom: 10 },
  title: { fontSize: 20, marginBottom: 16, textAlign: 'center' },
  error: { color: 'crimson', marginBottom: 8, textAlign: 'center' }
});
