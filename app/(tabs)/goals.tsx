import { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ScreenContainer } from '@/components/screen-container';
import { GoalCard } from '@/components/finance/GoalCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { SkeletonCard } from '@/components/ui/SkeletonLoader';
import { useColors } from '@/hooks/use-colors';
import { useGoalsStore, useAuthStore } from '@/store';
import { useGoals } from '@/hooks/useGoals';
import { formatCurrency } from '@/hooks/useFinance';

export default function GoalsScreen() {
  const colors = useColors();
  const { goals, isLoading } = useGoalsStore();
  const { user } = useAuthStore();
  const { loadGoals, deleteGoal } = useGoals();

  useEffect(() => {
    if (user?.id !== 'demo-user') loadGoals();
  }, [user]);

  const totalTarget = goals.reduce((s, g) => s + g.target_amount, 0);
  const totalCurrent = goals.reduce((s, g) => s + g.current_amount, 0);
  const completedGoals = goals.filter((g) => g.current_amount >= g.target_amount).length;

  const s = styles(colors);

  const renderHeader = () => (
    <View>
      {/* Summary Cards */}
      <View style={s.summaryRow}>
        <View style={s.summaryCard}>
          <MaterialIcons name="flag" size={20} color={colors.primary} />
          <Text style={s.summaryValue}>{goals.length}</Text>
          <Text style={s.summaryLabel}>Metas</Text>
        </View>
        <View style={s.summaryCard}>
          <MaterialIcons name="emoji-events" size={20} color={colors.income} />
          <Text style={[s.summaryValue, { color: colors.income }]}>{completedGoals}</Text>
          <Text style={s.summaryLabel}>Concluídas</Text>
        </View>
        <View style={s.summaryCard}>
          <MaterialIcons name="savings" size={20} color={colors.warning} />
          <Text style={[s.summaryValue, { color: colors.warning }]}>
            {totalTarget > 0 ? Math.round((totalCurrent / totalTarget) * 100) : 0}%
          </Text>
          <Text style={s.summaryLabel}>Progresso</Text>
        </View>
      </View>

      {/* Total Progress */}
      {goals.length > 0 && (
        <View style={s.totalCard}>
          <View style={s.totalRow}>
            <Text style={s.totalLabel}>Total economizado</Text>
            <Text style={s.totalValue}>{formatCurrency(totalCurrent)}</Text>
          </View>
          <View style={s.progressTrack}>
            <View
              style={[
                s.progressFill,
                {
                  width: totalTarget > 0 ? `${Math.min((totalCurrent / totalTarget) * 100, 100)}%` : '0%',
                },
              ]}
            />
          </View>
          <Text style={s.totalTarget}>Meta total: {formatCurrency(totalTarget)}</Text>
        </View>
      )}

      <Text style={s.sectionTitle}>Suas Metas</Text>
    </View>
  );

  return (
    <ScreenContainer containerClassName="bg-background">
      {/* Header */}
      <View style={s.header}>
        <Text style={s.title}>Metas</Text>
        <Pressable
          style={({ pressed }) => [s.addButton, pressed && s.pressed]}
          onPress={() => router.push('/goal/add')}
        >
          <MaterialIcons name="add" size={22} color="#FFFFFF" />
        </Pressable>
      </View>

      {isLoading ? (
        <View style={s.loadingContainer}>
          {[1, 2, 3].map((i) => <SkeletonCard key={i} height={120} />)}
        </View>
      ) : (
        <FlatList
          data={goals}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <GoalCard
              goal={item}
              onPress={() => router.push(`/goal/${item.id}`)}
            />
          )}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={
            <EmptyState
              icon="flag"
              title="Nenhuma meta criada"
              description="Defina metas financeiras para acompanhar seu progresso e alcançar seus objetivos."
              actionLabel="Criar primeira meta"
              onAction={() => router.push('/goal/add')}
            />
          }
          contentContainerStyle={s.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* FAB */}
      <Pressable
        style={({ pressed }) => [s.fab, pressed && s.fabPressed]}
        onPress={() => router.push('/goal/add')}
      >
        <MaterialIcons name="add" size={28} color="#FFFFFF" />
      </Pressable>
    </ScreenContainer>
  );
}

const styles = (colors: ReturnType<typeof useColors>) =>
  StyleSheet.create({
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 12,
    },
    title: {
      fontSize: 26,
      fontWeight: '800',
      color: colors.foreground,
      letterSpacing: -0.5,
    },
    addButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    pressed: { opacity: 0.8 },
    summaryRow: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 16,
    },
    summaryCard: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 12,
      alignItems: 'center',
      gap: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    summaryValue: {
      fontSize: 20,
      fontWeight: '800',
      color: colors.foreground,
    },
    summaryLabel: {
      fontSize: 11,
      color: colors.muted,
      fontWeight: '500',
    },
    totalCard: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 16,
      marginBottom: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 3,
    },
    totalRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    totalLabel: {
      fontSize: 13,
      color: colors.muted,
      fontWeight: '500',
    },
    totalValue: {
      fontSize: 18,
      fontWeight: '800',
      color: colors.foreground,
    },
    progressTrack: {
      height: 8,
      backgroundColor: colors.border,
      borderRadius: 4,
      overflow: 'hidden',
      marginBottom: 8,
    },
    progressFill: {
      height: '100%',
      backgroundColor: colors.primary,
      borderRadius: 4,
    },
    totalTarget: {
      fontSize: 12,
      color: colors.muted,
    },
    sectionTitle: {
      fontSize: 17,
      fontWeight: '700',
      color: colors.foreground,
      marginBottom: 12,
    },
    listContent: {
      paddingHorizontal: 20,
      paddingBottom: 100,
    },
    loadingContainer: {
      paddingHorizontal: 20,
    },
    fab: {
      position: 'absolute',
      bottom: 90,
      right: 20,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 8,
      elevation: 8,
    },
    fabPressed: {
      opacity: 0.85,
      transform: [{ scale: 0.95 }],
    },
  });
