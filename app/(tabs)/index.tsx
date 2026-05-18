import { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ScreenContainer } from '@/components/screen-container';
import { BalanceCard } from '@/components/finance/BalanceCard';
import { TransactionItem } from '@/components/finance/TransactionItem';
import { GoalCard } from '@/components/finance/GoalCard';
import { InsightCard } from '@/components/finance/InsightCard';
import { SimpleBarChart } from '@/components/finance/SimpleBarChart';
import { SimplePieChart } from '@/components/finance/SimplePieChart';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { SkeletonTransactionItem, SkeletonCard, Skeleton } from '@/components/ui/SkeletonLoader';
import { useColors } from '@/hooks/use-colors';
import { useAuthStore, useTransactionsStore, useGoalsStore } from '@/store';
import { useTransactions } from '@/hooks/useTransactions';
import { useGoals } from '@/hooks/useGoals';
import {
  useTransactionSummary,
  useMonthlySummaries,
  useCategorySummaries,
  useFinancialInsights,
} from '@/hooks/useFinance';

export default function DashboardScreen() {
  const colors = useColors();
  const { user } = useAuthStore();
  const { transactions, isLoading: txLoading } = useTransactionsStore();
  const { goals, isLoading: goalsLoading } = useGoalsStore();
  const { loadTransactions } = useTransactions();
  const { loadGoals } = useGoals();

  const { totalIncome, totalExpense, balance } = useTransactionSummary(transactions);
  const monthlySummaries = useMonthlySummaries(transactions, 6);
  const categorySummaries = useCategorySummaries(transactions, 'expense');
  const insights = useFinancialInsights(transactions);

  const recentTransactions = transactions.slice(0, 5);
  const recentGoals = goals.slice(0, 3);

  useEffect(() => {
    if (user?.id !== 'demo-user') {
      loadTransactions();
      loadGoals();
    }
  }, [user]);

  const onRefresh = useCallback(async () => {
    if (user?.id !== 'demo-user') {
      await Promise.all([loadTransactions(), loadGoals()]);
    }
  }, [user]);

  const s = styles(colors);
  const isLoading = txLoading || goalsLoading;

  return (
    <ScreenContainer containerClassName="bg-background">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {/* Top Bar */}
        <View style={s.topBar}>
          <View>
            <Text style={s.appTitle}>FinanceApp</Text>
            <Text style={s.date}>{formatTodayDate()}</Text>
          </View>
          <Pressable
            style={s.notificationButton}
            onPress={() => {}}
          >
            <MaterialIcons name="notifications-none" size={24} color={colors.foreground} />
          </Pressable>
        </View>

        {/* Balance Card */}
        <BalanceCard
          balance={balance}
          totalIncome={totalIncome}
          totalExpense={totalExpense}
          userName={user?.name}
        />

        {/* Quick Actions */}
        <View style={s.quickActions}>
          <Pressable
            style={({ pressed }) => [s.quickAction, pressed && s.pressed]}
            onPress={() => router.push('/transaction/add')}
          >
            <View style={[s.quickActionIcon, { backgroundColor: colors.primary + '15' }]}>
              <MaterialIcons name="add" size={22} color={colors.primary} />
            </View>
            <Text style={s.quickActionLabel}>Adicionar</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [s.quickAction, pressed && s.pressed]}
            onPress={() => router.push('/(tabs)/transactions')}
          >
            <View style={[s.quickActionIcon, { backgroundColor: colors.income + '15' }]}>
              <MaterialIcons name="swap-horiz" size={22} color={colors.income} />
            </View>
            <Text style={s.quickActionLabel}>Transações</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [s.quickAction, pressed && s.pressed]}
            onPress={() => router.push('/(tabs)/goals')}
          >
            <View style={[s.quickActionIcon, { backgroundColor: colors.warning + '15' }]}>
              <MaterialIcons name="flag" size={22} color={colors.warning} />
            </View>
            <Text style={s.quickActionLabel}>Metas</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [s.quickAction, pressed && s.pressed]}
            onPress={() => router.push('/(tabs)/profile')}
          >
            <View style={[s.quickActionIcon, { backgroundColor: colors.muted + '20' }]}>
              <MaterialIcons name="person" size={22} color={colors.muted} />
            </View>
            <Text style={s.quickActionLabel}>Perfil</Text>
          </Pressable>
        </View>

        {/* Monthly Chart */}
        <View style={s.section}>
          <SectionHeader title="Visão Mensal" />
          <View style={s.card}>
            {isLoading ? (
              <Skeleton width="100%" height={180} borderRadius={8} />
            ) : monthlySummaries.some((m) => m.totalIncome > 0 || m.totalExpense > 0) ? (
              <SimpleBarChart data={monthlySummaries} />
            ) : (
              <View style={s.chartEmpty}>
                <Text style={s.chartEmptyText}>Nenhum dado disponível</Text>
              </View>
            )}
          </View>
        </View>

        {/* Category Chart */}
        {categorySummaries.length > 0 && (
          <View style={s.section}>
            <SectionHeader title="Gastos por Categoria" />
            <View style={s.card}>
              <SimplePieChart data={categorySummaries} />
            </View>
          </View>
        )}

        {/* Insights */}
        <View style={s.section}>
          <SectionHeader title="Insights" />
          {insights.map((insight) => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </View>

        {/* Recent Transactions */}
        <View style={s.section}>
          <SectionHeader
            title="Últimas Transações"
            actionLabel="Ver todas"
            onAction={() => router.push('/(tabs)/transactions')}
          />
          {isLoading ? (
            <>
              <SkeletonTransactionItem />
              <SkeletonTransactionItem />
              <SkeletonTransactionItem />
            </>
          ) : recentTransactions.length > 0 ? (
            recentTransactions.map((tx) => (
              <TransactionItem
                key={tx.id}
                transaction={tx}
                onPress={() => router.push(`/transaction/${tx.id}`)}
              />
            ))
          ) : (
            <EmptyState
              icon="receipt-long"
              title="Nenhuma transação"
              description="Adicione sua primeira transação para começar."
              actionLabel="Adicionar transação"
              onAction={() => router.push('/transaction/add')}
            />
          )}
        </View>

        {/* Goals */}
        {recentGoals.length > 0 && (
          <View style={s.section}>
            <SectionHeader
              title="Metas Financeiras"
              actionLabel="Ver todas"
              onAction={() => router.push('/(tabs)/goals')}
            />
            {recentGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onPress={() => router.push(`/goal/${goal.id}`)}
              />
            ))}
          </View>
        )}

        <View style={{ height: 24 }} />
      </ScrollView>

      {/* FAB */}
      <Pressable
        style={({ pressed }) => [s.fab, pressed && s.fabPressed]}
        onPress={() => router.push('/transaction/add')}
      >
        <MaterialIcons name="add" size={28} color="#FFFFFF" />
      </Pressable>
    </ScreenContainer>
  );
}

function formatTodayDate(): string {
  return new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

const styles = (colors: ReturnType<typeof useColors>) =>
  StyleSheet.create({
    scrollContent: {
      paddingBottom: 100,
    },
    topBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 16,
    },
    appTitle: {
      fontSize: 22,
      fontWeight: '800',
      color: colors.foreground,
      letterSpacing: -0.5,
    },
    date: {
      fontSize: 12,
      color: colors.muted,
      marginTop: 2,
      textTransform: 'capitalize',
    },
    notificationButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    quickActions: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingHorizontal: 20,
      paddingVertical: 20,
    },
    quickAction: {
      alignItems: 'center',
      gap: 6,
    },
    quickActionIcon: {
      width: 52,
      height: 52,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    quickActionLabel: {
      fontSize: 11,
      fontWeight: '600',
      color: colors.muted,
    },
    pressed: {
      opacity: 0.7,
      transform: [{ scale: 0.97 }],
    },
    section: {
      paddingHorizontal: 20,
      marginBottom: 8,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 3,
    },
    chartEmpty: {
      height: 120,
      alignItems: 'center',
      justifyContent: 'center',
    },
    chartEmptyText: {
      color: colors.muted,
      fontSize: 14,
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
