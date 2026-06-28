import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { colors, radius, spacing, typography } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Chat'>;

type Message = { id: string; text: string; mine: boolean };

const initial: Message[] = [
  { id: '1', text: 'سلام، برنامهٔ این هفته چطور پیش رفت؟', mine: false },
  { id: '2', text: 'عالی بود مربی، همه جلسات رو انجام دادم.', mine: true },
  { id: '3', text: 'آفرین! هفتهٔ بعد شدت رو کمی بالا می‌بریم.', mine: false },
];

export function ChatScreen(_props: Props) {
  const [messages, setMessages] = useState<Message[]>(initial);
  const [draft, setDraft] = useState('');

  const send = () => {
    if (!draft.trim()) return;
    setMessages((prev) => [...prev, { id: String(prev.length + 1), text: draft.trim(), mine: true }]);
    setDraft('');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <FlatList
          data={messages}
          keyExtractor={(m) => m.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={[styles.bubble, item.mine ? styles.mine : styles.theirs]}>
              <Text style={[styles.bubbleText, item.mine && styles.mineText]}>{item.text}</Text>
            </View>
          )}
        />
        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            placeholder="پیام..."
            placeholderTextColor={colors.textMuted}
            value={draft}
            onChangeText={setDraft}
          />
          <Pressable style={styles.sendBtn} onPress={send}>
            <Ionicons name="send" size={20} color={colors.white} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  list: { padding: spacing.md, gap: spacing.sm },
  bubble: { maxWidth: '80%', padding: spacing.md, borderRadius: radius.lg },
  mine: { backgroundColor: colors.primary, alignSelf: 'flex-start' },
  theirs: { backgroundColor: colors.surface, alignSelf: 'flex-end' },
  bubbleText: { ...typography.body, color: colors.text, textAlign: 'right' },
  mineText: { color: colors.white },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  input: {
    flex: 1,
    height: 46,
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    color: colors.text,
    textAlign: 'right',
  },
  sendBtn: {
    width: 46,
    height: 46,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
