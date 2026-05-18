import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, G, Circle } from 'react-native-svg';
import { useColors } from '@/hooks/use-colors';
import { getCategoryById } from '@/constants/finance';
import { formatCurrency } from '@/hooks/useFinance';
import type { CategorySummary } from '@/types';

interface SimplePieChartProps {
  data: CategorySummary[];
  size?: number;
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle <= 180 ? '0' : '1';
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y} L ${cx} ${cy} Z`;
}

export function SimplePieChart({ data, size = 160 }: SimplePieChartProps) {
  const colors = useColors();
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 8;
  const innerR = r * 0.55;

  if (!data.length) return null;

  const total = data.reduce((s, d) => s + d.total, 0);
  let currentAngle = 0;

  const slices = data.slice(0, 6).map((item) => {
    const angle = (item.total / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;
    const category = getCategoryById(item.category);
    return { ...item, startAngle, endAngle, color: category.color };
  });

  const s = styles(colors);

  return (
    <View style={s.container}>
      {/* Pie */}
      <View style={s.chartWrapper}>
        <Svg width={size} height={size}>
          <G>
            {slices.map((slice, i) => (
              <Path
                key={i}
                d={describeArc(cx, cy, r, slice.startAngle, slice.endAngle)}
                fill={slice.color}
                opacity={0.9}
              />
            ))}
            {/* Inner circle (donut hole) */}
            <Circle cx={cx} cy={cy} r={innerR} fill={colors.surface} />
          </G>
        </Svg>
      </View>

      {/* Legend */}
      <View style={s.legend}>
        {slices.map((slice, i) => {
          const category = getCategoryById(slice.category);
          return (
            <View key={i} style={s.legendItem}>
              <View style={[s.legendDot, { backgroundColor: slice.color }]} />
              <Text style={s.legendLabel} numberOfLines={1}>{category.label}</Text>
              <Text style={s.legendValue}>{Math.round(slice.percentage)}%</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = (colors: ReturnType<typeof useColors>) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
    },
    chartWrapper: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
    },
    legend: {
      flex: 1,
      gap: 6,
    },
    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    legendDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
    },
    legendLabel: {
      flex: 1,
      fontSize: 12,
      color: colors.foreground,
    },
    legendValue: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.muted,
    },
  });
