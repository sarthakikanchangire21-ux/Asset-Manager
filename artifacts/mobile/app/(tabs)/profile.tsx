import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Alert,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useFinance } from '@/context/FinanceContext';

interface SettingRowProps {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'numeric' | 'decimal-pad';
  prefix?: string;
}

function SettingRow({ label, value, onChangeText, placeholder, keyboardType = 'default', prefix }: SettingRowProps) {
  const colors = useColors();
  return (
    <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
      <Text style={[styles.settingLabel, { color: colors.mutedForeground }]}>{label}</Text>
      <View style={styles.inputWrap}>
        {prefix ? <Text style={[styles.prefix, { color: colors.mutedForeground }]}>{prefix}</Text> : null}
        <TextInput
          style={[styles.settingInput, { color: colors.foreground }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.mutedForeground}
          keyboardType={keyboardType}
          textAlign="right"
        />
      </View>
    </View>
  );
}

interface StatItemProps { label: string; value: string; color?: string }
function StatItem({ label, value, color }: StatItemProps) {
  const colors = useColors();
  return (
    <View style={styles.statItem}>
      <Text style={[styles.statVal, { color: color ?? colors.foreground }]}>{value}</Text>
      <Text style={[styles.statLabel2, { color: colors.mutedForeground }]}>{label}</Text>
    </View>
  );
}

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { profile, updateProfile, transactions, budgets, clearAllData } = useFinance();

  const [name, setName] = useState(profile.name);
  const [income, setIncome] = useState(
    profile.monthlyIncome > 0 ? String(profile.monthlyIncome) : '',
  );

  const handleSave = () => {
    updateProfile({
      name: name.trim(),
      monthlyIncome: parseFloat(income) || 0,
    });
  };

  const now = new Date();
  const cm = now.getMonth();
  const cy = now.getFullYear();

  const curTxns = transactions.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === cm && d.getFullYear() === cy;
  });
  const totalIncome = curTxns.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpenses = curTxns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const savings = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (savings / totalIncome) * 100 : 0;

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all transactions, budgets, and chat history. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear Everything', style: 'destructive', onPress: clearAllData },
      ],
    );
  };

  const topInsets = Platform.OS === 'web' ? 67 : insets.top;
  const bottomInsets = Platform.OS === 'web' ? 34 : 0;

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: colors.background }]}
      contentContainerStyle={[
        styles.content,
        { paddingTop: topInsets + 16, paddingBottom: bottomInsets + 100 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Avatar + name */}
      <View style={styles.avatarSection}>
        <View style={[styles.avatar, { backgroundColor: colors.primary + '22' }]}>
          <Text style={[styles.avatarInitial, { color: colors.primary }]}>
            {profile.name ? profile.name.charAt(0).toUpperCase() : '?'}
          </Text>
        </View>
        <Text style={[styles.displayName, { color: colors.foreground }]}>
          {profile.name || 'Your Name'}
        </Text>
        <Text style={[styles.displaySub, { color: colors.mutedForeground }]}>
          Personal Finance Dashboard
        </Text>
      </View>

      {/* This month stats */}
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.cardTitle, { color: colors.foreground }]}>This Month</Text>
        <View style={styles.statsGrid}>
          <StatItem label="Income" value={`$${totalIncome.toFixed(0)}`} color={colors.income} />
          <StatItem label="Expenses" value={`$${totalExpenses.toFixed(0)}`} color={colors.expense} />
          <StatItem label="Savings" value={`$${Math.max(0, savings).toFixed(0)}`} color={colors.success} />
          <StatItem label="Save Rate" value={`${Math.max(0, savingsRate).toFixed(0)}%`} />
        </View>
      </View>

      {/* All-time stats */}
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.cardTitle, { color: colors.foreground }]}>All Time</Text>
        <View style={styles.statsGrid}>
          <StatItem label="Transactions" value={String(transactions.length)} />
          <StatItem label="Budgets" value={String(budgets.length)} />
          <StatItem
            label="Net Worth Δ"
            value={`${transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0) - transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0) >= 0 ? '+' : ''}$${(transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0) - transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)).toFixed(0)}`}
          />
          <StatItem
            label="Recurring"
            value={String(transactions.filter(t => t.isRecurring).length)}
          />
        </View>
      </View>

      {/* Settings */}
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.cardTitle, { color: colors.foreground }]}>Settings</Text>
        <SettingRow
          label="Your Name"
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
        />
        <SettingRow
          label="Monthly Income"
          value={income}
          onChangeText={setIncome}
          placeholder="0.00"
          keyboardType="decimal-pad"
          prefix="$"
        />
        <Pressable
          style={[styles.saveBtn, { backgroundColor: colors.primary }]}
          onPress={handleSave}
        >
          <Feather name="check" size={16} color={colors.primaryForeground} />
          <Text style={[styles.saveBtnTxt, { color: colors.primaryForeground }]}>Save Changes</Text>
        </Pressable>
      </View>

      {/* About */}
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.cardTitle, { color: colors.foreground }]}>About</Text>
        <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
          <Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>App</Text>
          <Text style={[styles.infoVal, { color: colors.foreground }]}>FinBuddy AI</Text>
        </View>
        <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
          <Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>Version</Text>
          <Text style={[styles.infoVal, { color: colors.foreground }]}>1.0.0</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>Storage</Text>
          <Text style={[styles.infoVal, { color: colors.foreground }]}>On-device (encrypted)</Text>
        </View>
      </View>

      {/* Danger zone */}
      <Pressable
        style={[styles.dangerBtn, { borderColor: colors.destructive }]}
        onPress={handleClearData}
      >
        <Feather name="trash-2" size={16} color={colors.destructive} />
        <Text style={[styles.dangerBtnTxt, { color: colors.destructive }]}>Clear All Data</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingHorizontal: 16, gap: 16 },
  avatarSection: { alignItems: 'center', paddingVertical: 16, gap: 8 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: { fontSize: 32, fontFamily: 'Inter_700Bold' },
  displayName: { fontSize: 22, fontFamily: 'Inter_700Bold' },
  displaySub: { fontSize: 13, fontFamily: 'Inter_400Regular' },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  cardTitle: { fontSize: 16, fontFamily: 'Inter_600SemiBold' },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statItem: { width: '45%', gap: 2 },
  statVal: { fontSize: 20, fontFamily: 'Inter_700Bold' },
  statLabel2: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  settingLabel: { fontSize: 14, fontFamily: 'Inter_400Regular' },
  inputWrap: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  prefix: { fontSize: 15, fontFamily: 'Inter_400Regular' },
  settingInput: {
    fontSize: 15,
    fontFamily: 'Inter_500Medium',
    minWidth: 100,
    textAlign: 'right',
    padding: 0,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 12,
    marginTop: 4,
  },
  saveBtnTxt: { fontSize: 15, fontFamily: 'Inter_600SemiBold' },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  infoLabel: { fontSize: 14, fontFamily: 'Inter_400Regular' },
  infoVal: { fontSize: 14, fontFamily: 'Inter_500Medium' },
  dangerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  dangerBtnTxt: { fontSize: 15, fontFamily: 'Inter_600SemiBold' },
});
