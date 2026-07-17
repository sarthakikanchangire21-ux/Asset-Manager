import React, { useState, useMemo } from 'react';
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
import { useColors } from '@/hooks/useColors';
import { useFinance } from '@/context/FinanceContext';
import { BudgetCard } from '@/components/BudgetCard';
import { DonutChart, DonutSegment } from '@/components/DonutChart';
import { CATEGORY_CONFIG } from '@/components/CategoryIcon';
import { Category } from '@/context/FinanceContext';

export default function BudgetsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { transactions, budgets } = useFinance();

  const now = new Date();
  const [viewMonth, setViewMonth] = useState(now.getMonth() + 1); // 1-12
  const [viewYear, setViewYear] = useState(now.getFullYear());

  const monthBudgets = useMemo(
    () => budgets.filter(b => b.month === viewMonth && b.year === viewYear),
    [budgets, viewMonth, viewYear],
  );

  const categorySpend = useMemo(() => {
    const map: Record<string, number> = {};
    transactions
      .filter(t => {
        const d = new Date(t.date);
        return (
          t.type === 'expense' &&
          d.getMonth() + 1 === viewMonth &&
          d.getFullYear() === viewYear
        );
      })
      .forEach(t => {
        map[t.category] = (map[t.category] || 0) + t.amount;
      });
    return map;
  }, [transactions, viewMonth, viewYear]);

  const totalBudgeted = useMemo(
    () => monthBudgets.reduce((s, b) => s + b.amount, 0),
    [monthBudgets],
  );
  const totalSpent = useMemo(
    () =>
      monthBudgets.reduce((s, b) => s + (categorySpend[b.category] || 0), 0),
    [monthBudgets, categorySpend],
  );

  const donutData: DonutSegment[] = useMemo(
    () =>
      monthBudgets.map(b => ({
        value: b.amount,
        color: CATEGORY_CONFIG[b.category as Category].color,
        label: b.category,
      })),
    [monthBudgets],
  );

  const navMonth = (dir: number) => {
    let m = viewMonth + dir;
    let y = viewYear;
    if (m > 12) { m = 1; y++; }
    if (m < 1) { m = 12; y--; }
    setViewMonth(m);
    setViewYear(y);
  };

  const monthLabel = new Date(viewYear, viewMonth - 1).toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  });

  const isCurrentMonth =
    viewMonth === now.getMonth() + 1 && viewYear === now.getFullYear();

  const overCount = monthBudgets.filter(
    b => (categorySpend[b.category] || 0) > b.amount,
  ).length;

  const topInsets = Platform.OS === 'web' ? 67 : insets.top;
  const bottomInsets = Platform.OS === 'web' ? 34 : 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[
          styles.headerArea,
          { paddingTop: topInsets + 12, backgroundColor: colors.background, borderBottomColor: colors.border },
        ]}
      >
        <Text style={[styles.screenTitle, { color: colors.foreground }]}>Budgets</Text>

        {/* Month navigator */}
        <View style={styles.monthNav}>
          <Pressable onPress={() => navMonth(-1)} hitSlop={12}>
            <Feather name="chevron-left" size={22} color={colors.foreground} />
          </Pressable>
          <Text style={[styles.monthLabel, { color: colors.foreground }]}>
            {monthLabel}
          </Text>
          <Pressable
            onPress={() => navMonth(1)}
            hitSlop={12}
            disabled={isCurrentMonth}
          >
            <Feather
              name="chevron-right"
              size={22}
              color={isCurrentMonth ? colors.mutedForeground : colors.foreground}
            />
          </Pressable>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: bottomInsets + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Overview card */}
        {monthBudgets.length > 0 && (
          <View
            style={[styles.overviewCard, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <View style={styles.overviewLeft}>
              <DonutChart
                data={donutData}
                size={130}
                strokeWidth={16}
                centerLabel="Budgeted"
                centerValue={`$${totalBudgeted.toFixed(0)}`}
              />
            </View>
            <View style={styles.overviewRight}>
              <View style={styles.overviewStat}>
                <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Total budgeted</Text>
                <Text style={[styles.statValue, { color: colors.foreground }]}>
                  ${totalBudgeted.toFixed(2)}
                </Text>
              </View>
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
              <View style={styles.overviewStat}>
                <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Spent so far</Text>
                <Text
                  style={[
                    styles.statValue,
                    { color: totalSpent > totalBudgeted ? colors.expense : colors.foreground },
                  ]}
                >
                  ${totalSpent.toFixed(2)}
                </Text>
              </View>
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
              <View style={styles.overviewStat}>
                <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Remaining</Text>
                <Text
                  style={[
                    styles.statValue,
                    { color: totalBudgeted - totalSpent < 0 ? colors.expense : colors.success },
                  ]}
                >
                  ${Math.abs(totalBudgeted - totalSpent).toFixed(2)}
                </Text>
              </View>
              {overCount > 0 && (
                <View style={[styles.overBadge, { backgroundColor: colors.expense + '22' }]}>
                  <Text style={[styles.overBadgeTxt, { color: colors.expense }]}>
                    {overCount} over limit
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Budget list */}
        {monthBudgets.length === 0 ? (
          <View style={styles.empty}>
            <Feather name="pie-chart" size={44} color={colors.border} />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
              No budgets for {monthLabel}
            </Text>
            <Text style={[styles.emptyDesc, { color: colors.mutedForeground }]}>
              Set spending limits by category to stay on track
            </Text>
            <Pressable
              style={[styles.emptyBtn, { backgroundColor: colors.primary }]}
              onPress={() => router.push('/add-budget')}
            >
              <Feather name="plus" size={16} color={colors.primaryForeground} />
              <Text style={[styles.emptyBtnTxt, { color: colors.primaryForeground }]}>
                Create a Budget
              </Text>
            </Pressable>
          </View>
        ) : (
          monthBudgets.map(budget => (
            <BudgetCard
              key={budget.id}
              budget={budget}
              spent={categorySpend[budget.category] || 0}
            />
          ))
        )}
      </ScrollView>

      {/* FAB */}
      <Pressable
        style={[
          styles.fab,
          {
            backgroundColor: colors.primary,
            bottom: (Platform.OS === 'web' ? 84 + 34 : 84) + 16,
          },
        ]}
        onPress={() => router.push('/add-budget')}
      >
        <Feather name="plus" size={24} color={colors.primaryForeground} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerArea: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    gap: 12,
  },
  screenTitle: { fontSize: 26, fontFamily: 'Inter_700Bold' },
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  monthLabel: { fontSize: 16, fontFamily: 'Inter_600SemiBold' },
  scroll: { flex: 1 },
  content: { padding: 16, gap: 0 },
  overviewCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  overviewLeft: {},
  overviewRight: { flex: 1, gap: 8 },
  overviewStat: { gap: 1 },
  statLabel: { fontSize: 11, fontFamily: 'Inter_400Regular' },
  statValue: { fontSize: 16, fontFamily: 'Inter_700Bold' },
  divider: { height: 1, marginVertical: 2 },
  overBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  overBadgeTxt: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },
  empty: {
    alignItems: 'center',
    paddingTop: 60,
    gap: 12,
    paddingHorizontal: 40,
  },
  emptyTitle: { fontSize: 18, fontFamily: 'Inter_600SemiBold', textAlign: 'center' },
  emptyDesc: { fontSize: 14, fontFamily: 'Inter_400Regular', textAlign: 'center' },
  emptyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 4,
  },
  emptyBtnTxt: { fontSize: 15, fontFamily: 'Inter_600SemiBold' },
  fab: {
    position: 'absolute',
    right: 20,
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00C896',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8,
  },
});
