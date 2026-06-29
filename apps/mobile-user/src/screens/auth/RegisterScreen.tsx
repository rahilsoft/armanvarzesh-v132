import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';
import { Button } from '../../components/Button';
import { useAuthStore } from '../../store/authStore';
import { colors, radius, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export function RegisterScreen({ navigation }: Props) {
  const signIn = useAuthStore((s) => s.signIn);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!name.trim() || !email.trim() || !password) return;
    setLoading(true);
    try {
      // TODO: replace with a real register mutation.
      await new Promise((r) => setTimeout(r, 600));
      await signIn('demo-token', { id: 'me', name, email });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.brand}>ساخت حساب</Text>

        <TextInput
          style={styles.input}
          placeholder="نام و نام خانوادگی"
          placeholderTextColor={colors.textMuted}
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="ایمیل"
          placeholderTextColor={colors.textMuted}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="رمز عبور"
          placeholderTextColor={colors.textMuted}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Button title="ثبت‌نام" onPress={onSubmit} loading={loading} style={styles.cta} />
        <Button title="بازگشت به ورود" variant="ghost" onPress={() => navigation.goBack()} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, justifyContent: 'center', padding: spacing.lg, gap: spacing.md },
  brand: { ...typography.h1, color: colors.secondary, textAlign: 'center', marginBottom: spacing.lg },
  input: {
    height: 52,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    color: colors.text,
    textAlign: 'right',
  },
  cta: { marginTop: spacing.sm },
});
