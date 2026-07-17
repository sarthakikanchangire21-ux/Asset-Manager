import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';

type FeatherName = React.ComponentProps<typeof Feather>['name'];

interface StatCardProps {
  title: string;
  value: string;
  icon: FeatherName;
  iconColor: string;
  subtitle?: string;
}

export function StatCard({ title, value, icon, iconColor, subtitle }: StatCardProps) {
  const colors = useColors();

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <View
        style={[
          styles.iconBox,
          { backgroundColor: iconColor + '22' },
        ]}
      >
        <Feather name={icon} size={17} color={iconColor} />
      </View>
      <Text
        style={[styles.value, { color: colors.foreground }]}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {value}
      </Text>
      <Text style={[styles.title, { color: colors.mutedForeground }]}>{title}</Text>
      {subtitle ? (
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>{subtitle}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    gap: 5,
  },
  iconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  value: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
  },
  title: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  subtitle: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    marginTop: -2,
  },
});
