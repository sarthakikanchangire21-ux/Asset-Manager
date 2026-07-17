import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import { CategoryIcon, CATEGORY_CONFIG } from '@/components/CategoryIcon';
import { useFinance, Budget, CATEGORY_LABELS } from '@/context/FinanceContext';

interface BudgetCardProps {
  budget: Budget;
  spent: number;
}

export function BudgetCard({ budget, spent }: BudgetCardProps) {
  const colors = useColors();
  const { deleteBudget } = useFinance();
  const cfg = CATEGORY_CONFIG[budget.category];
  const progress = budget.amount > 0 ? Math.min(spent / budget.amount, 1) : 0;
  const isOver = spent > budget.amount;
  const isNear = !isOver && progress >= 0.8;
  const barColor = isOver ? colors.expense : cfg.color;

  const progressAnim = useSharedValue(0);
  const [trackWidth, setTrackWidth] = useState(0);

  useEffect(() => {
    if (trackWidth > 0) {
      progressAnim.value = withTiming(progress * trackWidth, { duration: 900 });
    }
  }, [progress, trackWidth]);

  const animStyle = useAnimatedStyle(() => ({
    width: progressAnim.value,
  }));

  const handleDelete = () => {
    Alert.alert(
      'Remove Budget',
      `Remove ${CATEGORY_LABELS[budget.category]} budget?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => deleteBudget(budget.id),
        },
      ],
    );
  };

  const handleEdit = () => {
    router.push({ pathname: '/add-budget', params: { id: budget.id } });
  };

  return (
    <Pressable
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={handleEdit}
    >
      <View style={styles.header}>
        <CategoryIcon category={budget.category} size={42} />
        <View style={styles.info}>
          <Text style={[styles.catName, { color: colors.foreground }]}>
            {CATEGORY_LABELS[budget.category]}
          </Text>
          <Text style={[styles.amounts, { color: colors.mutedForeground }]}>
            ${spent.toFixed(2)} of ${budget.amount.toFixed(2)}
          </Text>
        </View>
        <View style={styles.right}>
          {isOver && (
            <View style={[styles.badge, { backgroundColor: colors.expense + '22' }]}>
              <Text style={[styles.badgeTxt, { color: colors.expense }]}>Over</Text>
            </View>
          )}
          {isNear && !isOver && (
            <View style={[styles.badge, { backgroundColor: colors.warning + '22' }]}>
              <Text style={[styles.badgeTxt, { color: colors.warning }]}>Near</Text>
            </View>
          )}
          <Pressable onPress={handleDelete} hitSlop={12}>
            <Feather name="trash-2" size={15} color={colors.mutedForeground} />
          </Pressable>
        </View>
      </View>

      <View style={styles.barRow}>
        <View
          style={[styles.track, { backgroundColor: colors.secondary }]}
          onLayout={e => setTrackWidth(e.nativeEvent.layout.width)}
        >
          <Animated.View
            style={[styles.fill, { backgroundColor: barColor }, animStyle]}
          />
        </View>
        <Text style={[styles.pct, { color: isOver ? colors.expense : colors.mutedForeground }]}>
          {Math.round(progress * 100)}%
        </Text>
      </View>

      <Text
        style={[
          styles.remaining,
          { color: isOver ? colors.expense : colors.success },
        ]}
      >
        {isOver
          ? `$${(spent - budget.amount).toFixed(2)} over budget`
          : `$${(budget.amount - spent).toFixed(2)} remaining`}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  catName: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
  },
  amounts: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeTxt: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  track: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 3,
  },
  pct: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    width: 36,
    textAlign: 'right',
  },
  remaining: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
  },
});
