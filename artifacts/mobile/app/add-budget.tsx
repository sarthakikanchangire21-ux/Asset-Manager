import React, { useState } from 'react';
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
import { useFinance, Category, CATEGORY_LABELS } from '@/context/FinanceContext';
import { CategoryIcon } from '@/components/CategoryIcon';

const CATEGORIES: Category[] = [
  'food', 'transport', 'entertainment', 'shopping',
  'utilities', 'healthcare', 'education', 'other',
];

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export default function AddBudgetModal() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { addBudget, editBudget, budgets } = useFinance();
  const params = useLocalSearchParams<{ id?: string }>();
  const editId = params?.id;

  const now = new Date();
  const existing = editId ? budgets.find(b => b.id === editId) : null;

  const [category, setCategory] = useState<Category>(existing?.category ?? 'food');
  const [amount, setAmount] = useState(existing ? String(existing.amount) : '');
  const [month, setMonth] = useState(existing?.month ?? now.getMonth() + 1);
  const [year, setYear] = useState(existing?.year ?? now.getFullYear());
  const [error, setError] = useState('');

  const isValid = amount.trim() !== '' && parseFloat(amount) > 0;

  const handleSave = () => {
    if (!isValid) {
      setError('Please enter a valid budget amount.');
      return;
    }
    // Check for duplicate (same category/month/year)
    if (!editId) {
      const duplicate = budgets.find(
        b => b.category === category && b.month === month && b.year === year,
      );
      if (duplicate) {
        setError(`A budget for ${CATEGORY_LABELS[category]} in ${MONTHS[month - 1]} already exists.`);
        return;
      }
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const payload = { category, amount: parseFloat(amount), month, year };
    if (editId) {
      editBudget(editId, payload);
    } else {
      addBudget(payload);
    }
    router.back();
  };

  const navMonth = (dir: number) => {
    let m = month + dir;
    let y = year;
    if (m > 12) { m = 1; y++; }
    if (m < 1) { m = 12; y--; }
    setMonth(m);
    setYear(y);
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
          {editId ? 'Edit Budget' : 'New Budget'}
        </Text>
        <Pressable
          onPress={handleSave}
          disabled={!isValid}
          style={[styles.saveBtn, { backgroundColor: isValid ? colors.primary : colors.muted }]}
        >
          <Text
            style={[styles.saveBtnTxt, { color: isValid ? colors.primaryForeground : colors.mutedForeground }]}
          >
            Save
          </Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: bottomInsets + 40 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {error ? (
          <View style={[styles.errorBanner, { backgroundColor: colors.destructive + '22' }]}>
            <Text style={[styles.errorTxt, { color: colors.destructive }]}>{error}</Text>
          </View>
        ) : null}

        {/* Month picker */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>Month</Text>
          <View style={styles.monthNav}>
            <Pressable onPress={() => navMonth(-1)} hitSlop={12}>
              <Feather name="chevron-left" size={22} color={colors.foreground} />
            </Pressable>
            <Text style={[styles.monthTxt, { color: colors.foreground }]}>
              {MONTHS[month - 1]} {year}
            </Text>
            <Pressable onPress={() => navMonth(1)} hitSlop={12}>
              <Feather name="chevron-right" size={22} color={colors.foreground} />
            </Pressable>
          </View>
        </View>

        {/* Category */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
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
                onPress={() => { setCategory(cat); setError(''); }}
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

        {/* Amount */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>Budget Limit</Text>
          <View style={styles.amountRow}>
            <Text style={[styles.currencySymbol, { color: colors.primary }]}>$</Text>
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
          {parseFloat(amount) > 0 && (
            <Text style={[styles.amountHint, { color: colors.mutedForeground }]}>
              ${(parseFloat(amount) / 30).toFixed(2)} per day
            </Text>
          )}
        </View>
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
  saveBtn: { paddingHorizontal: 16, paddingVertical: 7, borderRadius: 10 },
  saveBtnTxt: { fontSize: 15, fontFamily: 'Inter_600SemiBold' },
  content: { padding: 16, gap: 12 },
  errorBanner: { padding: 12, borderRadius: 10 },
  errorTxt: { fontSize: 13, fontFamily: 'Inter_400Regular' },
  card: { borderRadius: 16, borderWidth: 1, padding: 16, gap: 12 },
  fieldLabel: { fontSize: 12, fontFamily: 'Inter_500Medium', textTransform: 'uppercase', letterSpacing: 0.5 },
  monthNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  monthTxt: { fontSize: 18, fontFamily: 'Inter_600SemiBold' },
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
  amountRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  currencySymbol: { fontSize: 32, fontFamily: 'Inter_700Bold' },
  amountInput: { fontSize: 40, fontFamily: 'Inter_700Bold', flex: 1, padding: 0 },
  amountHint: { fontSize: 12, fontFamily: 'Inter_400Regular' },
});
