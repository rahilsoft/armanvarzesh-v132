import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../components/ScreenContainer';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useAuthStore } from '../store/authStore';
import { colors, radius, spacing, typography } from '../theme';

const menu = [
  { id: 'wallet', label: 'کیف پول', icon: 'wallet' as const },
  { id: 'orders', label: 'سفارش‌ها', icon: 'bag-handle' as const },
  { id: 'settings', label: 'تنظیمات', icon: 'settings' as const },
  { id: 'support', label: 'پشتیبانی', icon: 'help-circle' as const },
];

export function ProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);

  return (
    <ScreenContainer title="پروفایل">
      <Card style={styles.profileCard}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={32} color={colors.secondary} />
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.name}>{user?.name ?? 'کاربر'}</Text>
          <Text style={styles.email}>{user?.email ?? ''}</Text>
        </View>
      </Card>

      {menu.map((m) => (
        <Card key={m.id} style={styles.row}>
          <Ionicons name={m.icon} size={22} color={colors.primaryLight} />
          <Text style={styles.rowLabel}>{m.label}</Text>
          <Ionicons name="chevron-back" size={20} color={colors.textMuted} />
        </Card>
      ))}

      <Button title="خروج از حساب" variant="ghost" onPress={() => void signOut()} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  profileCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: { flex: 1, gap: spacing.xs },
  name: { ...typography.h2, color: colors.text, textAlign: 'right' },
  email: { ...typography.caption, color: colors.textMuted, textAlign: 'right' },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  rowLabel: { ...typography.body, color: colors.text, flex: 1, textAlign: 'right' },
});
