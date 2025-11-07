import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, borderRadius, spacing, shadows } from '@config/theme';
import { useSettingsStore } from '@store/settings.store';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: number;
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  padding = spacing.md,
  noPadding = false,
}) => {
  const { isDarkMode } = useSettingsStore();

  const cardStyles = [
    styles.card,
    isDarkMode && styles.card_dark,
    !noPadding && { padding },
    style,
  ];

  return <View style={cardStyles}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    ...shadows.md,
  },
  card_dark: {
    backgroundColor: colors.surfaceDark,
  },
});
