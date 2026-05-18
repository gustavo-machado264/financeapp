import { View, Text, Pressable, StyleSheet } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useColors } from '@/hooks/use-colors';
import { formatCurrency, formatDate } from '@/hooks/useFinance';
import type { Goal } from '@/types';

interface GoalCardProps {
  goal: Goal;
  onPress?: () => void;
}

export function GoalCard({ goal, onPress }: GoalCardProps) {
  const colors = useColors();
  const progress = Math.min((goal.current_amount / goal.target_amount) * 100, 100);
  const isCompleted = progress >= 100;

  const s = styles(colors);

  return (
    <Pressable
      style={({ pressed }) => [s.card, pressed && s.pressed]}
      onPress={onPress}
    >
      {/* Header */}
      <View style={s.header}>
        <View style={[s.iconContainer, { backgroundColor: isCompleted ? colors.income + '20' : colors.primary + '20' }]}>
          <MaterialIcons
            name={isCompleted ? 'emoji-events' : 'flag'}
            size={20}
            color={isCompleted ? colors.income : colors.primary}
          />
        </View>
        <View style={s.titleContainer}>
          <Text style={s.title} numberOfLines={1}>{goal.title}</Text>
          {goal.deadline && (
            <Text style={s.deadline}>Prazo: {formatDate(goal.deadline)}</Text>
          )}
        </View>
        <Text style={[s.percentage, { color: isCompleted ? colors.income : colors.primary }]}>
          {Math.round(progress)}%
        </Text>
      </View>

      {/* Progress Bar */}
      <View style={s.progressTrack}>
        <View
          style={[
            s.progressFill,
            {
              width: `${progress}%`,
              backgroundColor: isCompleted ? colors.income : colors.primary,
            },
          ]}
        />
      </View>

      {/* Amounts */}
      <View style={s.amountsRow}>
        <Text style={s.currentAmount}>{formatCurrency(goal.current_amount)}</Text>
        <Text style={s.separator}> / </Text>
        <Text style={s.targetAmount}>{formatCurrency(goal.target_amount)}</Text>
        {isCompleted && (
          <View style={s.completedBadge}>
            <Text style={s.completedText}>Concluída!</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = (colors: ReturnType<typeof useColors>) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 3,
    },
    pressed: {
      opacity: 0.8,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    titleContainer: {
      flex: 1,
    },
    title: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.foreground,
    },
    deadline: {
      fontSize: 11,
      color: colors.muted,
      marginTop: 2,
    },
    percentage: {
      fontSize: 18,
      fontWeight: '700',
    },
    progressTrack: {
      height: 6,
      backgroundColor: colors.border,
      borderRadius: 3,
      overflow: 'hidden',
      marginBottom: 8,
    },
    progressFill: {
      height: '100%',
      borderRadius: 3,
    },
    amountsRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    currentAmount: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.foreground,
    },
    separator: {
      fontSize: 13,
      color: colors.muted,
    },
    targetAmount: {
      fontSize: 13,
      color: colors.muted,
    },
    completedBadge: {
      marginLeft: 'auto',
      backgroundColor: colors.income + '20',
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 999,
    },
    completedText: {
      fontSize: 11,
      fontWeight: '600',
      color: colors.income,
    },
  });
