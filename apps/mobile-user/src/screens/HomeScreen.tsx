import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { ScreenContainer } from '../components/ScreenContainer';
import { Card } from '../components/Card';
import { useAuthStore } from '../store/authStore';
import { colors, radius, spacing, typography } from '../theme';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const stats = [
  { label: 'تمرین این هفته', value: '۴', icon: 'barbell' as const },
  { label: 'کالری امروز', value: '۱٬۸۴۰', icon: 'flame' as const },
  { label: 'پیام جدید', value: '۲', icon: 'chatbubbles' as const },
];

export function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const user = useAuthStore((s) => s.user);

  return (
    <ScreenContainer title={`سلام ${user?.name ?? ''}`} subtitle="امروز هم برای پیشرفت آماده‌ای؟">
      <View style={styles.row}>
        {stats.map((s) => (
          <Card key={s.label} style={styles.stat}>
            <Ionicons name={s.icon} size={22} color={colors.secondary} />
            <Text style={styles.statValue}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </Card>
        ))}
      </View>

      <Pressable onPress={() => navigation.navigate('Notifications')}>
        <Card style={styles.banner}>
          <Ionicons name="notifications" size={22} color={colors.primaryLight} />
          <Text style={styles.bannerText}>مشاهدهٔ اعلان‌ها</Text>
          <Ionicons name="chevron-back" size={20} color={colors.textMuted} />
        </Card>
      </Pressable>

      <Pressable onPress={() => navigation.navigate('Chat')}>
        <Card style={styles.banner}>
          <Ionicons name="chatbubbles" size={22} color={colors.primaryLight} />
          <Text style={styles.bannerText}>گفتگو با مربی</Text>
          <Ionicons name="chevron-back" size={20} color={colors.textMuted} />
        </Card>
      </Pressable>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.sm },
  stat: { flex: 1, alignItems: 'center', gap: spacing.xs, paddingVertical: spacing.md },
  statValue: { ...typography.h2, color: colors.text },
  statLabel: { ...typography.caption, color: colors.textMuted, textAlign: 'center' },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderRadius: radius.lg,
  },
  bannerText: { ...typography.body, color: colors.text, flex: 1, textAlign: 'right' },
});
