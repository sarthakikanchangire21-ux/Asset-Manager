import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useColors } from '@/hooks/useColors';
import { useFinance, Transaction, Category, CATEGORY_LABELS } from '@/context/FinanceContext';
import { CategoryIcon } from '@/components/CategoryIcon';

const CATEGORIES: Category[] = [
  'food', 'transport', 'entertainment', 'shopping',
  'utilities', 'healthcare', 'education', 'other',
];

export default function AddTransactionModal() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { addTransaction, editTransaction, transactions } = useFinance();
  const params = useLocalSearchParams<{ id?: string }>();
  const editId = params?.id;

  const existing = editId ? transactions.find(t => t.id === editId) : null;

  const [type, setType] = useState<'income' | 'expense'>(existing?.type ?? 'expense');
  const [amount, setAmount] = useState(existing ? String(existing.amount) : '');
  const [description, setDescription] = useState(existing?.description ?? '');
  const [category, setCategory] = useState<Category>(existing?.category ?? 'food');
  const [date, setDate] = useState(existing?.date ?? new Date().toISOString().split('T')[0]);
  const [isRecurring, setIsRecurring] = useState(existing?.isRecurring ?? false);
  const [error, setError] = useState('');

  const isValid = amount.trim() !== '' && parseFloat(amount) > 0 && description.trim() !== '';

  const handleSave = () => {
    if (!isValid) {
      setError('Please enter a valid amount and description.');
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const payload: Omit<Transaction, 'id'> = {
      amount: parseFloat(amount),
      type,
      description: description.trim(),
      category,
      date,
      isRecurring,
    };
    if (editId) {
      editTransaction(editId, payload);
    } else {
      addTransaction(payload);
    }
    router.back();
  };

  const bottomInsets = Platform.OS === 'web' ? 34 : insets.bottom;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          { borderBottomColor: colors.border, paddingTop: Platform.OS === 'ios' ? 16 : 12 },
        ]}
      >
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Feather name="x" size={22} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>
          {editId ? 'Edit Transaction' : 'New Transaction'}
        </Text>
        <Pressable
          onPress={handleSave}
          disabled={!isValid}
          style={[
            styles.saveBtn,
            { backgroundColor: isValid ? colors.primary : colors.muted },
          ]}
        >
          <Text
            style={[
              styles.saveBtnTxt,
              { color: isValid ? colors.primaryForeground : colors.mutedForeground },
            ]}
          >
            Save
          </Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: bottomInsets + 40 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {error ? (
          <View style={[styles.errorBanner, { backgroundColor: colors.destructive + '22' }]}>
            <Text style={[styles.errorTxt, { color: colors.destructive }]}>{error}</Text>
          </View>
        ) : null}

        {/* Type toggle */}
        <View style={[styles.typeRow, { backgroundColor: colors.secondary }]}>
          {(['expense', 'income'] as const).map(t => (
            <Pressable
              key={t}
              style={[
                styles.typeBtn,
                type === t && {
                  backgroundColor: t === 'expense' ? colors.expense : colors.income,
                },
              ]}
              onPress={() => { setType(t); setError(''); }}
            >
              <Feather
                name={t === 'expense' ? 'trending-down' : 'trending-up'}
                size={15}
                color={type === t ? '#FFFFFF' : colors.mutedForeground}
              />
              <Text
                style={[
                  styles.typeBtnTxt,
                  { color: type === t ? '#FFFFFF' : colors.mutedForeground },
                ]}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Amount */}
        <View style={[styles.amountCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>Amount</Text>
          <View style={styles.amountRow}>
            <Text style={[styles.currencySymbol, { color: type === 'expense' ? colors.expense : colors.income }]}>
              $
            </Text>
            <TextInput
              style={[styles.amountInput, { color: colors.foreground }]}
              value={amount}
              onChangeText={v => { setAmount(v.replace(/[^0-9.]/g, '')); setError(''); }}
              placeholder="0.00"
              placeholderTextColor={colors.mutedForeground}
              keyboardType="decimal-pad"
              autoFocus
            />
          </View>
        </View>

        {/* Description */}
        <View style={[styles.fieldCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>Description</Text>
          <TextInput
            style={[styles.descInput, { color: colors.foreground }]}
            value={description}
            onChangeText={v => { setDescription(v); setError(''); }}
            placeholder="What was this for?"
            placeholderTextColor={colors.mutedForeground}
            maxLength={80}
          />
        </View>

        {/* Date */}
        <View style={[styles.fieldCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>Date</Text>
          <TextInput
            style={[styles.descInput, { color: colors.foreground }]}
            value={date}
            onChangeText={setDate}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={colors.mutedForeground}
            keyboardType="numbers-and-punctuation"
          />
        </View>

        {/* Category */}
        <View style={[styles.fieldCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>Category</Text>
          <View style={styles.categoryGrid}>
            {CATEGORIES.map(cat => (
              <Pressable
                key={cat}
                style={[
                  styles.catOption,
                  { borderColor: category === cat ? colors.primary : colors.border },
                  category === cat && { backgroundColor: colors.primary + '11' },
                ]}
                onPress={() => setCategory(cat)}
              >
                <CategoryIcon category={cat} size={36} />
                <Text
                  style={[
                    styles.catLabel,
                    { color: category === cat ? colors.primary : colors.mutedForeground },
                  ]}
                  numberOfLines={1}
                >
                  {CATEGORY_LABELS[cat].split(' ')[0]}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Recurring toggle */}
        <Pressable
          style={[
            styles.toggleRow,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
          onPress={() => setIsRecurring(v => !v)}
        >
          <View style={styles.toggleInfo}>
            <Feather name="repeat" size={18} color={isRecurring ? colors.primary : colors.mutedForeground} />
            <View>
              <Text style={[styles.toggleLabel, { color: colors.foreground }]}>Recurring</Text>
              <Text style={[styles.toggleSub, { color: colors.mutedForeground }]}>
                Monthly recurring transaction
              </Text>
            </View>
          </View>
          <View
            style={[
              styles.toggle,
              { backgroundColor: isRecurring ? colors.primary : colors.secondary },
            ]}
          >
            <View
              style={[
                styles.toggleThumb,
                { transform: [{ translateX: isRecurring ? 18 : 2 }] },
              ]}
            />
          </View>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 17, fontFamily: 'Inter_600SemiBold' },
  saveBtn: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 10,
  },
  saveBtnTxt: { fontSize: 15, fontFamily: 'Inter_600SemiBold' },
  content: { padding: 16, gap: 12 },
  errorBanner: {
    padding: 12,
    borderRadius: 10,
  },
  errorTxt: { fontSize: 13, fontFamily: 'Inter_400Regular' },
  typeRow: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  typeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
  },
  typeBtnTxt: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  amountCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 6,
  },
  fieldCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 8,
  },
  fieldLabel: { fontSize: 12, fontFamily: 'Inter_500Medium', textTransform: 'uppercase', letterSpacing: 0.5 },
  amountRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  currencySymbol: { fontSize: 32, fontFamily: 'Inter_700Bold' },
  amountInput: { fontSize: 40, fontFamily: 'Inter_700Bold', flex: 1, padding: 0 },
  descInput: { fontSize: 16, fontFamily: 'Inter_400Regular', padding: 0 },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  catOption: {
    width: '22%',
    alignItems: 'center',
    gap: 5,
    padding: 8,
    borderRadius: 12,
    borderWidth: 2,
  },
  catLabel: { fontSize: 10, fontFamily: 'Inter_500Medium', textAlign: 'center' },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  toggleInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  toggleLabel: { fontSize: 15, fontFamily: 'Inter_500Medium' },
  toggleSub: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  toggle: {
    width: 42,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
});
