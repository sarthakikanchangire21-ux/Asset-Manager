import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import type { Category } from '@/context/FinanceContext';

type FeatherName = React.ComponentProps<typeof Feather>['name'];

export const CATEGORY_CONFIG: Record<
  Category,
  { icon: FeatherName; color: string }
> = {
  food: { icon: 'coffee', color: '#FF6B6B' },
  transport: { icon: 'navigation', color: '#4ECDC4' },
  entertainment: { icon: 'film', color: '#A78BFA' },
  shopping: { icon: 'shopping-bag', color: '#F59E0B' },
  utilities: { icon: 'zap', color: '#60A5FA' },
  healthcare: { icon: 'heart', color: '#F87171' },
  education: { icon: 'book-open', color: '#34D399' },
  other: { icon: 'more-horizontal', color: '#9CA3AF' },
};

interface CategoryIconProps {
  category: Category;
  size?: number;
}

export function CategoryIcon({ category, size = 42 }: CategoryIconProps) {
  const { icon, color } = CATEGORY_CONFIG[category];
  const iconSize = Math.floor(size * 0.44);

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 3.5,
          backgroundColor: color + '22',
        },
      ]}
    >
      <Feather name={icon} size={iconSize} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
