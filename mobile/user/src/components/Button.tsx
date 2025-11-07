import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors, borderRadius, spacing, typography, shadows } from '@config/theme';
import { useSettingsStore } from '@store/settings.store';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
  textStyle,
  icon,
}) => {
  const { isDarkMode } = useSettingsStore();

  const buttonStyles = [
    styles.button,
    styles[`button_${size}`],
    styles[`button_${variant}`],
    isDarkMode && styles[`button_${variant}_dark`],
    fullWidth && styles.fullWidth,
    (disabled || loading) && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`text_${size}`],
    styles[`text_${variant}`],
    isDarkMode && styles[`text_${variant}_dark`],
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? colors.background : colors.primary}
        />
      ) : (
        <>
          {icon && icon}
          <Text style={textStyles}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
    ...shadows.sm,
  },
  button_small: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.xs,
  },
  button_medium: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  button_large: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    gap: spacing.sm,
  },
  button_primary: {
    backgroundColor: colors.primary,
  },
  button_primary_dark: {
    backgroundColor: colors.primaryDark,
  },
  button_secondary: {
    backgroundColor: colors.secondary,
  },
  button_secondary_dark: {
    backgroundColor: colors.secondaryDark,
  },
  button_outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  button_outline_dark: {
    borderColor: colors.primaryDark,
  },
  button_ghost: {
    backgroundColor: 'transparent',
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    ...typography.body,
    fontWeight: '600',
  },
  text_small: {
    ...typography.caption,
    fontWeight: '600',
  },
  text_medium: {
    ...typography.body,
    fontWeight: '600',
  },
  text_large: {
    ...typography.h4,
    fontWeight: '600',
  },
  text_primary: {
    color: colors.background,
  },
  text_primary_dark: {
    color: colors.textDark,
  },
  text_secondary: {
    color: colors.background,
  },
  text_secondary_dark: {
    color: colors.textDark,
  },
  text_outline: {
    color: colors.primary,
  },
  text_outline_dark: {
    color: colors.primaryDark,
  },
  text_ghost: {
    color: colors.primary,
  },
  text_ghost_dark: {
    color: colors.primaryDark,
  },
});
