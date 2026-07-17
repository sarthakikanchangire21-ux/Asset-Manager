import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  TextInput,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import { useFinance, Transaction } from '@/context/FinanceContext';
import { TransactionItem } from '@/components/TransactionItem';

type Filter = 'all' | 'income' | 'expense';

function groupByDate(transactions: Transaction[]) {
  const groups: { date: string; items: Transaction[] }[] = [];
  const map: Record<string, Transaction[]> = {};

  transactions.forEach(t => {
    const d = new Date(t.date);
    const key = d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
    if (!map[key]) {
      map[key] = [];
      groups.push({ date: key, items: map[key] });
    }
    map[key].push(t);
  });

  return groups;
}

export default function TransactionsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { transactions } = useFinance();
  const [filter, setFilter] = useState<Filter>('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let list = transactions;
    if (filter !== 'all') list = list.filter(t => t.type === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        t =>
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q),
      );
    }
    return list;
  }, [transactions, filter, search]);

  const groups = useMemo(() => groupByDate(filtered), [filtered]);

  const totalIncome = useMemo(
    () => filtered.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0),
    [filtered],
  );
  const totalExpenses = useMemo(
    () => filtered.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
    [filtered],
  );

  type ListItem =
    | { type: 'header'; date: string }
    | { type: 'transaction'; transaction: Transaction };

  const flatData: ListItem[] = useMemo(() => {
    const items: ListItem[] = [];
    groups.forEach(g => {
      items.push({ type: 'header', date: g.date });
      g.items.forEach(tx => items.push({ type: 'transaction', transaction: tx }));
    });
    return items;
  }, [groups]);

  const topInsets = Platform.OS === 'web' ? 67 : insets.top;
  const bottomInsets = Platform.OS === 'web' ? 34 : 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Custom header */}
      <View
        style={[
          styles.headerArea,
          {
            paddingTop: topInsets + 12,
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <Text style={[styles.screenTitle, { color: colors.foreground }]}>Transactions</Text>

        {/* Summary chips */}
        <View style={styles.summaryRow}>
          <View style={[styles.chip, { backgroundColor: colors.income + '22' }]}>
            <Feather name="arrow-down-circle" size={13} color={colors.income} />
            <Text style={[styles.chipTxt, { color: colors.income }]}>
              +${totalIncome.toFixed(2)}
            </Text>
          </View>
          <View style={[styles.chip, { backgroundColor: colors.expense + '22' }]}>
            <Feather name="arrow-up-circle" size={13} color={colors.expense} />
            <Text style={[styles.chipTxt, { color: colors.expense }]}>
              -${totalExpenses.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Search */}
        <View style={[styles.searchBox, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
          <Feather name="search" size={16} color={colors.mutedForeground} />
          <TextInput
            style={[styles.searchInput, { color: colors.foreground }]}
            placeholder="Search transactions..."
            placeholderTextColor={colors.mutedForeground}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch('')}>
              <Feather name="x" size={16} color={colors.mutedForeground} />
            </Pressable>
          )}
        </View>

        {/* Filter tabs */}
        <View style={[styles.filterRow, { backgroundColor: colors.secondary }]}>
          {(['all', 'income', 'expense'] as Filter[]).map(f => (
            <Pressable
              key={f}
              style={[
                styles.filterTab,
                filter === f && { backgroundColor: colors.card },
              ]}
              onPress={() => setFilter(f)}
            >
              <Text
                style={[
                  styles.filterTxt,
                  {
                    color: filter === f ? colors.foreground : colors.mutedForeground,
                    fontFamily: filter === f ? 'Inter_600SemiBold' : 'Inter_400Regular',
                  },
                ]}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* List */}
      <FlatList
        data={flatData}
        keyExtractor={(item, i) =>
          item.type === 'header' ? `h-${item.date}` : `t-${item.transaction.id}`
        }
        renderItem={({ item }) => {
          if (item.type === 'header') {
            return (
              <Text style={[styles.dateHeader, { color: colors.mutedForeground }]}>
                {item.date}
              </Text>
            );
          }
          return (
            <View style={{ paddingHorizontal: 16 }}>
              <TransactionItem transaction={item.transaction} />
            </View>
          );
        }}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: bottomInsets + 100 },
        ]}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="inbox" size={40} color={colors.border} />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
              No transactions
            </Text>
            <Text style={[styles.emptyDesc, { color: colors.mutedForeground }]}>
              {search ? 'Try a different search' : 'Tap + to add your first transaction'}
            </Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />

      {/* FAB */}
      <Pressable
        style={[
          styles.fab,
          {
            backgroundColor: colors.primary,
            bottom: (Platform.OS === 'web' ? 84 + 34 : 84) + 16,
          },
        ]}
        onPress={() => router.push('/add-transaction')}
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
    gap: 10,
  },
  screenTitle: {
    fontSize: 26,
    fontFamily: 'Inter_700Bold',
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 10,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  chipTxt: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    padding: 0,
  },
  filterRow: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: 3,
  },
  filterTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 7,
    borderRadius: 8,
  },
  filterTxt: {
    fontSize: 13,
  },
  listContent: {
    paddingTop: 8,
  },
  dateHeader: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    paddingHorizontal: 16,
    paddingVertical: 8,
    paddingTop: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 60,
    gap: 10,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    marginTop: 8,
  },
  emptyDesc: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
  },
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
