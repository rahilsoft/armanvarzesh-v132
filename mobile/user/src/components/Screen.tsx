import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  ViewStyle,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '@config/theme';
import { useSettingsStore } from '@store/settings.store';

interface ScreenProps {
  children: React.ReactNode;
  style?: ViewStyle;
  scrollable?: boolean;
  safeArea?: boolean;
  padding?: boolean;
  keyboardAvoiding?: boolean;
}

export const Screen: React.FC<ScreenProps> = ({
  children,
  style,
  scrollable = false,
  safeArea = true,
  padding = true,
  keyboardAvoiding = true,
}) => {
  const { isDarkMode } = useSettingsStore();

  const containerStyles = [
    styles.container,
    isDarkMode && styles.container_dark,
    padding && styles.padding,
    style,
  ];

  const content = scrollable ? (
    <ScrollView
      style={containerStyles}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={containerStyles}>{children}</View>
  );

  const Container = safeArea ? SafeAreaView : View;

  if (keyboardAvoiding) {
    return (
      <Container style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.flex}
        >
          {content}
        </KeyboardAvoidingView>
      </Container>
    );
  }

  return <Container style={styles.safeArea}>{content}</Container>;
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container_dark: {
    backgroundColor: colors.backgroundDark,
  },
  padding: {
    padding: spacing.md,
  },
  scrollContent: {
    flexGrow: 1,
  },
  flex: {
    flex: 1,
  },
});
