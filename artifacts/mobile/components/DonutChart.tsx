import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { useColors } from '@/hooks/useColors';

export interface DonutSegment {
  value: number;
  color: string;
  label: string;
}

interface DonutChartProps {
  data: DonutSegment[];
  size?: number;
  strokeWidth?: number;
  centerLabel?: string;
  centerValue?: string;
}

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(cx: number, cy: number, r: number, start: number, end: number) {
  const s = polar(cx, cy, r, start);
  const e = polar(cx, cy, r, end);
  const large = end - start > 180 ? 1 : 0;
  return `M ${s.x.toFixed(3)} ${s.y.toFixed(3)} A ${r} ${r} 0 ${large} 1 ${e.x.toFixed(3)} ${e.y.toFixed(3)}`;
}

export function DonutChart({
  data,
  size = 180,
  strokeWidth = 22,
  centerLabel,
  centerValue,
}: DonutChartProps) {
  const colors = useColors();
  const r = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;

  const nonZero = data.filter(d => d.value > 0);
  const total = nonZero.reduce((s, d) => s + d.value, 0);
  const GAP = nonZero.length > 1 ? 2 : 0;

  let cursor = 0;

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        {/* Track */}
        <Circle
          cx={cx}
          cy={cy}
          r={r}
          stroke={colors.border}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {total === 0 && (
          <Circle
            cx={cx}
            cy={cy}
            r={r}
            stroke={colors.muted}
            strokeWidth={strokeWidth}
            fill="none"
          />
        )}
        {nonZero.map((seg, i) => {
          const sweep = (seg.value / total) * 360;
          const startAngle = cursor + GAP / 2;
          const endAngle = cursor + sweep - GAP / 2;
          cursor += sweep;

          if (sweep >= 358) {
            return (
              <Circle
                key={i}
                cx={cx}
                cy={cy}
                r={r}
                stroke={seg.color}
                strokeWidth={strokeWidth}
                fill="none"
              />
            );
          }

          return (
            <Path
              key={i}
              d={arcPath(cx, cy, r, startAngle, endAngle)}
              stroke={seg.color}
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="butt"
            />
          );
        })}
      </Svg>

      <View style={[StyleSheet.absoluteFill, styles.center]}>
        {centerValue ? (
          <Text style={[styles.centerVal, { color: colors.foreground }]}>
            {centerValue}
          </Text>
        ) : null}
        {centerLabel ? (
          <Text style={[styles.centerLbl, { color: colors.mutedForeground }]}>
            {centerLabel}
          </Text>
        ) : null}
        {total === 0 ? (
          <Text style={[styles.centerLbl, { color: colors.mutedForeground }]}>
            No data
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerVal: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
  },
  centerLbl: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    marginTop: 2,
  },
});
