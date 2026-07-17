import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useColors } from '@/hooks/useColors';
import { useFinance } from '@/context/FinanceContext';
import { StatCard } from '@/components/StatCard';
import { TransactionItem } from '@/components/TransactionItem';
import { DonutChart, DonutSegment } from '@/components/DonutChart';
import { CATEGORY_CONFIG } from '@/components/CategoryIcon';
import { CATEGORY_LABELS, Category } from '@/context/FinanceContext';

export default function DashboardScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { transactions, budgets } = useFinance();

  const now = new Date();
  const cm = now.getMonth();
  const cy = now.getFullYear();

  const curTxns = useMemo(
    () =>
      transactions.filter(t => {
        const d = new Date(t.date);
        return d.getMonth() === cm && d.getFullYear() === cy;
      }),
    [transactions, cm, cy],
  );

  const totalIncome = useMemo(
    () => curTxns.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0),
    [curTxns],
  );

  const totalExpenses = useMemo(
    () => curTxns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
    [curTxns],
  );

  const balance = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (balance / totalIncome) * 100 : 0;

  const categorySpend = useMemo(() => {
    const map: Record<string, number> = {};
    curTxns.filter(t => t.type === 'expense').forEach(t => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
    return map;
  }, [curTxns]);

  const donutData: DonutSegment[] = useMemo(
    () =>
      Object.entries(categorySpend)
        .filter(([, v]) => v > 0)
        .map(([cat, val]) => ({
          value: val,
          color: CATEGORY_CONFIG[cat as Category].color,
          label: CATEGORY_LABELS[cat as Category],
        })),
    [categorySpend],
  );

  const recent = transactions.slice(0, 5);

  const monthName = now.toLocaleString('default', { month: 'long' });

  const topInsets = Platform.OS === 'web' ? 67 : insets.top;
  const bottomInsets = Platform.OS === 'web' ? 120 : 100;

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: colors.background }]}
      contentContainerStyle={[
        styles.content,
        { paddingTop: topInsets + 16, paddingBottom: bottomInsets },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: colors.mutedForeground }]}>
            {monthName} Overview
          </Text>
          <Text style={[styles.appTitle, { color: colors.foreground }]}>FinBuddy AI</Text>
        </View>
        <Pressable
          style={[styles.addBtn, { backgroundColor: colors.primary }]}
          onPress={() => router.push('/add-transaction')}
        >
          <Feather name="plus" size={20} color={colors.primaryForeground} />
        </Pressable>
      </View>

      {/* Balance card */}
      <LinearGradient
        colors={['#00C896', '#009970']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.balanceCard}
      >
        <Text style={styles.balanceLbl}>Net Balance</Text>
        <Text style={styles.balanceAmt}>
          {balance >= 0 ? '+' : '-'}${Math.abs(balance).toFixed(2)}
        </Text>
        {totalIncome > 0 && (
          <Text style={styles.savingsLbl}>
            Savings rate: {savingsRate.toFixed(1)}%
          </Text>
        )}
      </LinearGradient>

      {/* Stats row */}
      <View style={styles.statsRow}>
        <StatCard
          title="Income"
          value={`$${totalIncome.toFixed(0)}`}
          icon="trending-up"
          iconColor={colors.income}
          subtitle={monthName}
        />
        <StatCard
          title="Expenses"
          value={`$${totalExpenses.toFixed(0)}`}
          icon="trending-down"
          iconColor={colors.expense}
          subtitle={`${curTxns.filter(t => t.type === 'expense').length} items`}
        />
      </View>

      {/* Spending breakdown */}
      <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
          Spending Breakdown
        </Text>
        {donutData.length > 0 ? (
          <View style={styles.chartRow}>
            <DonutChart
              data={donutData}
              size={160}
              strokeWidth={20}
              centerLabel="Spent"
              centerValue={`$${totalExpenses.toFixed(0)}`}
            />
            <View style={styles.legend}>
              {donutData.slice(0, 5).map((seg, i) => (
                <View key={i} style={styles.legendRow}>
                  <View style={[styles.legendDot, { backgroundColor: seg.color }]} />
                  <Text
                    style={[styles.legendLabel, { color: colors.mutedForeground }]}
                    numberOfLines={1}
                  >
                    {seg.label}
                  </Text>
                  <Text style={[styles.legendAmt, { color: colors.foreground }]}>
                    ${seg.value.toFixed(0)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.emptyChart}>
            <Feather name="pie-chart" size={32} color={colors.border} />
            <Text style={[styles.emptyTxt, { color: colors.mutedForeground }]}>
              No expenses yet this month
            </Text>
          </View>
        )}
      </View>

      {/* Recent transactions */}
      <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Recent Activity
          </Text>
          <Pressable onPress={() => router.push('/(tabs)/transactions')}>
            <Text style={[styles.seeAll, { color: colors.primary }]}>See all</Text>
          </Pressable>
        </View>
        {recent.length === 0 ? (
          <View style={styles.emptyChart}>
            <Feather name="list" size={32} color={colors.border} />
            <Text style={[styles.emptyTxt, { color: colors.mutedForeground }]}>
              No transactions yet
            </Text>
            <Pressable
              style={[styles.emptyBtn, { backgroundColor: colors.primary }]}
              onPress={() => router.push('/add-transaction')}
            >
              <Text style={[styles.emptyBtnTxt, { color: colors.primaryForeground }]}>
                Add your first transaction
              </Text>
            </Pressable>
          </View>
        ) : (
          recent.map(tx => <TransactionItem key={tx.id} transaction={tx} />)
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingHorizontal: 16, gap: 16 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: { fontSize: 13, fontFamily: 'Inter_400Regular' },
  appTitle: { fontSize: 24, fontFamily: 'Inter_700Bold', marginTop: 1 },
  addBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  balanceCard: {
    borderRadius: 20,
    padding: 24,
    gap: 4,
  },
  balanceLbl: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
  },
  balanceAmt: {
    color: '#FFFFFF',
    fontSize: 38,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -1,
  },
  savingsLbl: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    marginTop: 4,
  },
  statsRow: { flexDirection: 'row', gap: 12 },
  section: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: { fontSize: 16, fontFamily: 'Inter_600SemiBold' },
  seeAll: { fontSize: 14, fontFamily: 'Inter_500Medium' },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  legend: { flex: 1, gap: 8 },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendLabel: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  legendAmt: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
  },
  emptyChart: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 10,
  },
  emptyTxt: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  emptyBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 4,
  },
  emptyBtnTxt: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
});
