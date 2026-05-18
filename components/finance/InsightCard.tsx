import { View, Text, StyleSheet } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useColors } from '@/hooks/use-colors';
import type { FinancialInsight } from '@/types';

interface InsightCardProps {
  insight: FinancialInsight;
}

export function InsightCard({ insight }: InsightCardProps) {
  const colors = useColors();

  const config = {
    warning: { bg: colors.warning + '15', border: colors.warning + '40', icon: colors.warning },
    success: { bg: colors.income + '15', border: colors.income + '40', icon: colors.income },
    info: { bg: colors.primary + '10', border: colors.primary + '30', icon: colors.primary },
  }[insight.type];

  const s = styles(colors);

  return (
    <View style={[s.card, { backgroundColor: config.bg, borderColor: config.border }]}>
      <View style={[s.iconContainer, { backgroundColor: config.icon + '20' }]}>
        <MaterialIcons name={insight.icon as any} size={18} color={config.icon} />
      </View>
      <Text style={s.message}>{insight.message}</Text>
    </View>
  );
}

const styles = (colors: ReturnType<typeof useColors>) =>
  StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 12,
      padding: 12,
      borderWidth: 1,
      marginBottom: 8,
    },
    iconContainer: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    message: {
      flex: 1,
      fontSize: 13,
      color: colors.foreground,
      lineHeight: 18,
    },
  });
