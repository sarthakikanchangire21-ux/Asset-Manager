import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
  Platform,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useColors } from '@/hooks/useColors';
import { useFinance, ChatMessage } from '@/context/FinanceContext';
import { generateAIResponse, SUGGESTED_QUESTIONS } from '@/utils/aiAdvisor';

function MessageBubble({ msg }: { msg: ChatMessage }) {
  const colors = useColors();
  const isUser = msg.role === 'user';

  return (
    <View style={[styles.bubbleRow, isUser && styles.bubbleRowUser]}>
      {!isUser && (
        <View style={[styles.avatar, { backgroundColor: colors.primary + '22' }]}>
          <Feather name="cpu" size={14} color={colors.primary} />
        </View>
      )}
      <View
        style={[
          styles.bubble,
          isUser
            ? [styles.bubbleUser, { backgroundColor: colors.primary }]
            : [styles.bubbleAI, { backgroundColor: colors.card, borderColor: colors.border }],
          { maxWidth: '80%' },
        ]}
      >
        <Text
          style={[
            styles.bubbleTxt,
            { color: isUser ? colors.primaryForeground : colors.foreground },
          ]}
        >
          {msg.content}
        </Text>
        <Text
          style={[
            styles.timestamp,
            { color: isUser ? 'rgba(255,255,255,0.6)' : colors.mutedForeground },
          ]}
        >
          {new Date(msg.timestamp).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
          })}
        </Text>
      </View>
    </View>
  );
}

export default function AIAdvisorScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { chatHistory, addMessage, clearHistory, transactions, budgets } = useFinance();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const flatRef = useRef<FlatList>(null);

  const topInsets = Platform.OS === 'web' ? 67 : insets.top;
  const bottomInsets = Platform.OS === 'web' ? 34 : insets.bottom;

  const handleSend = async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;

    setInput('');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    addMessage({ role: 'user', content: msg });
    setLoading(true);

    // Simulate a brief thinking delay for better UX
    await new Promise(r => setTimeout(r, 600));

    const response = generateAIResponse(msg, transactions, budgets);
    addMessage({ role: 'assistant', content: response });
    setLoading(false);
  };

  const displayMessages = [...chatHistory].reverse();

  const handleClear = () => {
    clearHistory();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: topInsets + 12,
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <View style={styles.headerLeft}>
          <View style={[styles.aiAvatar, { backgroundColor: colors.primary + '22' }]}>
            <Feather name="cpu" size={18} color={colors.primary} />
          </View>
          <View>
            <Text style={[styles.headerTitle, { color: colors.foreground }]}>
              AI Advisor
            </Text>
            <Text style={[styles.headerSub, { color: colors.success }]}>
              Online · Powered by AI
            </Text>
          </View>
        </View>
        {chatHistory.length > 0 && (
          <Pressable onPress={handleClear} hitSlop={12}>
            <Feather name="trash-2" size={18} color={colors.mutedForeground} />
          </Pressable>
        )}
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior="padding"
        keyboardVerticalOffset={0}
      >
        {/* Messages */}
        {chatHistory.length === 0 ? (
          <ScrollView
            style={styles.flex}
            contentContainerStyle={[styles.emptyContainer, { paddingBottom: bottomInsets + 120 }]}
            keyboardShouldPersistTaps="handled"
          >
            <View style={[styles.emptyIcon, { backgroundColor: colors.primary + '22' }]}>
              <Feather name="cpu" size={32} color={colors.primary} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
              Your Financial Advisor
            </Text>
            <Text style={[styles.emptyDesc, { color: colors.mutedForeground }]}>
              Ask me anything about your spending, budgets, savings strategies, and financial goals.
            </Text>

            <Text style={[styles.suggestLabel, { color: colors.mutedForeground }]}>
              Try asking:
            </Text>
            <View style={styles.suggestions}>
              {SUGGESTED_QUESTIONS.map((q, i) => (
                <Pressable
                  key={i}
                  style={[styles.suggestionChip, { backgroundColor: colors.card, borderColor: colors.border }]}
                  onPress={() => handleSend(q)}
                >
                  <Text style={[styles.suggestionTxt, { color: colors.foreground }]}>{q}</Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        ) : (
          <FlatList
            ref={flatRef}
            data={loading ? [{ id: 'loading', role: 'assistant' as const, content: '...', timestamp: '' }, ...displayMessages] : displayMessages}
            keyExtractor={item => item.id}
            inverted
            renderItem={({ item }) => {
              if (item.id === 'loading') {
                return (
                  <View style={[styles.bubbleRow]}>
                    <View style={[styles.avatar, { backgroundColor: colors.primary + '22' }]}>
                      <Feather name="cpu" size={14} color={colors.primary} />
                    </View>
                    <View style={[styles.bubble, styles.bubbleAI, { backgroundColor: colors.card, borderColor: colors.border }]}>
                      <ActivityIndicator size="small" color={colors.primary} />
                    </View>
                  </View>
                );
              }
              return <MessageBubble msg={item} />;
            }}
            contentContainerStyle={[
              styles.messageList,
              { paddingBottom: 16, paddingTop: 8 },
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
          />
        )}

        {/* Input bar */}
        <View
          style={[
            styles.inputBar,
            {
              backgroundColor: colors.background,
              borderTopColor: colors.border,
              paddingBottom: bottomInsets + 84 + 8,
            },
          ]}
        >
          {/* Quick suggestions (when there are messages) */}
          {chatHistory.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.quickSuggestions}
            >
              {SUGGESTED_QUESTIONS.slice(0, 4).map((q, i) => (
                <Pressable
                  key={i}
                  style={[styles.quickChip, { backgroundColor: colors.secondary, borderColor: colors.border }]}
                  onPress={() => handleSend(q)}
                >
                  <Text style={[styles.quickChipTxt, { color: colors.foreground }]}>
                    {q}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          )}

          <View style={styles.inputRow}>
            <View
              style={[
                styles.inputBox,
                { backgroundColor: colors.secondary, borderColor: colors.border },
              ]}
            >
              <TextInput
                style={[styles.input, { color: colors.foreground }]}
                placeholder="Ask your financial advisor..."
                placeholderTextColor={colors.mutedForeground}
                value={input}
                onChangeText={setInput}
                multiline
                maxLength={500}
                onSubmitEditing={() => handleSend()}
                returnKeyType="send"
                blurOnSubmit
              />
            </View>
            <Pressable
              style={[
                styles.sendBtn,
                {
                  backgroundColor:
                    input.trim() && !loading ? colors.primary : colors.muted,
                },
              ]}
              onPress={() => handleSend()}
              disabled={!input.trim() || loading}
            >
              <Feather
                name="send"
                size={18}
                color={input.trim() && !loading ? colors.primaryForeground : colors.mutedForeground}
              />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  aiAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: 17, fontFamily: 'Inter_600SemiBold' },
  headerSub: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingTop: 40,
    gap: 12,
  },
  emptyIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: { fontSize: 20, fontFamily: 'Inter_700Bold', textAlign: 'center' },
  emptyDesc: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    lineHeight: 20,
  },
  suggestLabel: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    marginTop: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  suggestions: { gap: 8, width: '100%' },
  suggestionChip: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  suggestionTxt: { fontSize: 14, fontFamily: 'Inter_400Regular' },
  messageList: { paddingHorizontal: 16 },
  bubbleRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginBottom: 12,
  },
  bubbleRowUser: { flexDirection: 'row-reverse' },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  bubble: {
    padding: 12,
    borderRadius: 18,
    gap: 4,
  },
  bubbleUser: { borderBottomRightRadius: 4 },
  bubbleAI: { borderWidth: 1, borderBottomLeftRadius: 4 },
  bubbleTxt: {
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    lineHeight: 22,
  },
  timestamp: { fontSize: 10, fontFamily: 'Inter_400Regular', alignSelf: 'flex-end' },
  inputBar: {
    borderTopWidth: 1,
    paddingTop: 8,
    paddingHorizontal: 12,
    gap: 8,
  },
  quickSuggestions: {
    gap: 8,
    paddingHorizontal: 4,
    paddingBottom: 4,
  },
  quickChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  quickChipTxt: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  inputBox: {
    flex: 1,
    borderRadius: 22,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 120,
  },
  input: {
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    padding: 0,
    maxHeight: 100,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
