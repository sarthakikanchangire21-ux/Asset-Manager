import React from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import { CategoryIcon, CATEGORY_CONFIG } from '@/components/CategoryIcon';
import { useFinance, Transaction, CATEGORY_LABELS } from '@/context/FinanceContext';

function fmtDate(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const txDay = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  if (txDay === today) return 'Today';
  if (txDay === today - 86400000) return 'Yesterday';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

interface TransactionItemProps {
  transaction: Transaction;
}

export function TransactionItem({ transaction }: TransactionItemProps) {
  const colors = useColors();
  const { deleteTransaction } = useFinance();
  const cfg = CATEGORY_CONFIG[transaction.category];

  const handlePress = () => {
    router.push({ pathname: '/add-transaction', params: { id: transaction.id } });
  };

  const handleLongPress = () => {
    Alert.alert('Delete Transaction', `Remove "${transaction.description}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteTransaction(transaction.id),
      },
    ]);
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.row,
        { opacity: pressed ? 0.7 : 1 },
      ]}
      onPress={handlePress}
      onLongPress={handleLongPress}
    >
      <CategoryIcon category={transaction.category} size={44} />

      <View style={styles.info}>
        <Text
          style={[styles.desc, { color: colors.foreground }]}
          numberOfLines={1}
        >
          {transaction.description}
        </Text>
        <View style={styles.meta}>
          <Text style={[styles.catLabel, { color: cfg.color }]}>
            {CATEGORY_LABELS[transaction.category]}
          </Text>
          <Text style={[styles.dot, { color: colors.mutedForeground }]}> · </Text>
          <Text style={[styles.date, { color: colors.mutedForeground }]}>
            {fmtDate(transaction.date)}
          </Text>
          {transaction.isRecurring && (
            <Feather
              name="repeat"
              size={11}
              color={colors.mutedForeground}
              style={{ marginLeft: 4 }}
            />
          )}
        </View>
      </View>

      <Text
        style={[
          styles.amount,
          {
            color:
              transaction.type === 'income' ? colors.income : colors.expense,
          },
        ]}
      >
        {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 0,
    gap: 12,
  },
  info: {
    flex: 1,
    gap: 3,
  },
  desc: {
    fontSize: 15,
    fontFamily: 'Inter_500Medium',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  catLabel: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  dot: {
    fontSize: 12,
  },
  date: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  amount: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
  },
});
