import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Rect, G, Text as SvgText } from 'react-native-svg';
import { useColors } from '@/hooks/use-colors';
import type { MonthlySummary } from '@/types';
import { SHORT_MONTHS_PT } from '@/constants/finance';

interface SimpleBarChartProps {
  data: MonthlySummary[];
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_WIDTH = SCREEN_WIDTH - 80;
const CHART_HEIGHT = 160;
const BAR_GAP = 4;

export function SimpleBarChart({ data }: SimpleBarChartProps) {
  const colors = useColors();

  if (!data.length) return null;

  const maxValue = Math.max(...data.map((d) => Math.max(d.totalIncome, d.totalExpense)), 1);
  const barGroupWidth = (CHART_WIDTH - BAR_GAP) / data.length;
  const barWidth = (barGroupWidth - BAR_GAP * 3) / 2;

  const s = styles(colors);

  return (
    <View style={s.container}>
      <Svg width={CHART_WIDTH} height={CHART_HEIGHT + 24}>
        {data.map((item, i) => {
          const x = i * barGroupWidth;
          const incomeHeight = (item.totalIncome / maxValue) * CHART_HEIGHT;
          const expenseHeight = (item.totalExpense / maxValue) * CHART_HEIGHT;

          return (
            <G key={i} x={x + BAR_GAP}>
              {/* Income bar */}
              <Rect
                x={0}
                y={CHART_HEIGHT - incomeHeight}
                width={barWidth}
                height={Math.max(incomeHeight, 2)}
                rx={4}
                fill={colors.income}
                opacity={0.85}
              />
              {/* Expense bar */}
              <Rect
                x={barWidth + BAR_GAP}
                y={CHART_HEIGHT - expenseHeight}
                width={barWidth}
                height={Math.max(expenseHeight, 2)}
                rx={4}
                fill={colors.expense}
                opacity={0.85}
              />
              {/* Month label */}
              <SvgText
                x={barWidth}
                y={CHART_HEIGHT + 16}
                fontSize={10}
                fill={colors.muted}
                textAnchor="middle"
              >
                {SHORT_MONTHS_PT[item.month]}
              </SvgText>
            </G>
          );
        })}
      </Svg>

      {/* Legend */}
      <View style={s.legend}>
        <View style={s.legendItem}>
          <View style={[s.legendDot, { backgroundColor: colors.income }]} />
          <Text style={s.legendText}>Receitas</Text>
        </View>
        <View style={s.legendItem}>
          <View style={[s.legendDot, { backgroundColor: colors.expense }]} />
          <Text style={s.legendText}>Despesas</Text>
        </View>
      </View>
    </View>
  );
}

const styles = (colors: ReturnType<typeof useColors>) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
    },
    legend: {
      flexDirection: 'row',
      marginTop: 8,
      gap: 16,
    },
    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    legendDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    legendText: {
      fontSize: 12,
      color: colors.muted,
    },
  });
