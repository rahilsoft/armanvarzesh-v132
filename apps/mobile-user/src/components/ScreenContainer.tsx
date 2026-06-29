import React from 'react';
import { View, Text, StyleSheet, ScrollView, I18nManager } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '../theme';

type Props = {
  title?: string;
  subtitle?: string;
  scroll?: boolean;
  children: React.ReactNode;
};

export function ScreenContainer({ title, subtitle, scroll = true, children }: Props) {
  const Body = scroll ? ScrollView : View;
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {title ? (
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
      ) : null}
      <Body
        style={styles.body}
        contentContainerStyle={scroll ? styles.content : undefined}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </Body>
    </SafeAreaView>
  );
}

const rtl = I18nManager.isRTL;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.sm },
  title: { ...typography.h1, color: colors.text, textAlign: rtl ? 'right' : 'left' },
  subtitle: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xs,
    textAlign: rtl ? 'right' : 'left',
  },
  body: { flex: 1 },
  content: { padding: spacing.lg, gap: spacing.md },
});
