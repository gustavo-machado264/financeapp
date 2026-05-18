import { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  StyleSheet,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ScreenContainer } from '@/components/screen-container';
import { TransactionItem } from '@/components/finance/TransactionItem';
import { EmptyState } from '@/components/ui/EmptyState';
import { SkeletonTransactionItem } from '@/components/ui/SkeletonLoader';
import { useColors } from '@/hooks/use-colors';
import { useTransactionsStore, useAuthStore } from '@/store';
import { useTransactions } from '@/hooks/useTransactions';
import { useTransactionSummary, formatCurrency } from '@/hooks/useFinance';
import { CATEGORIES, MONTHS_PT } from '@/constants/finance';
import type { Transaction } from '@/types';

export default function TransactionsScreen() {
  const colors = useColors();
  const { transactions, isLoading } = useTransactionsStore();
  const { user } = useAuthStore();
  const { loadTransactions, deleteTransaction } = useTransactions();

  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'income' | 'expense'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<number>(-1); // -1 = all

  useEffect(() => {
    if (user?.id !== 'demo-user') loadTransactions();
  }, [user]);

  const currentMonth = new Date().getMonth();

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const matchSearch =
        !search ||
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.description?.toLowerCase().includes(search.toLowerCase());
      const matchType = selectedType === 'all' || t.type === selectedType;
      const matchCategory = selectedCategory === 'all' || t.category === selectedCategory;
      const matchMonth =
        selectedMonth === -1 || new Date(t.date).getMonth() === selectedMonth;
      return matchSearch && matchType && matchCategory && matchMonth;
    });
  }, [transactions, search, selectedType, selectedCategory, selectedMonth]);

  const { totalIncome, totalExpense } = useTransactionSummary(filtered);

  const handleDelete = (tx: Transaction) => {
    Alert.alert(
      'Excluir transação',
      `Deseja excluir "${tx.title}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => deleteTransaction(tx.id),
        },
      ]
    );
  };

  const s = styles(colors);

  const renderHeader = () => (
    <View>
      {/* Summary */}
      <View style={s.summaryRow}>
        <View style={[s.summaryCard, { borderLeftColor: colors.income }]}>
          <Text style={s.summaryLabel}>Receitas</Text>
          <Text style={[s.summaryValue, { color: colors.income }]}>{formatCurrency(totalIncome)}</Text>
        </View>
        <View style={[s.summaryCard, { borderLeftColor: colors.expense }]}>
          <Text style={s.summaryLabel}>Despesas</Text>
          <Text style={[s.summaryValue, { color: colors.expense }]}>{formatCurrency(totalExpense)}</Text>
        </View>
      </View>

      {/* Search */}
      <View style={s.searchContainer}>
        <MaterialIcons name="search" size={20} color={colors.muted} style={s.searchIcon} />
        <TextInput
          style={s.searchInput}
          placeholder="Buscar transações..."
          placeholderTextColor={colors.muted}
          value={search}
          onChangeText={setSearch}
        />
        {search ? (
          <Pressable onPress={() => setSearch('')}>
            <MaterialIcons name="close" size={18} color={colors.muted} />
          </Pressable>
        ) : null}
      </View>

      {/* Type Filter */}
      <View style={s.filterRow}>
        {(['all', 'income', 'expense'] as const).map((type) => (
          <Pressable
            key={type}
            style={[s.filterChip, selectedType === type && s.filterChipActive]}
            onPress={() => setSelectedType(type)}
          >
            <Text style={[s.filterChipText, selectedType === type && s.filterChipTextActive]}>
              {type === 'all' ? 'Todos' : type === 'income' ? 'Receitas' : 'Despesas'}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Month Filter */}
      <View style={s.filterRow}>
        <Pressable
          style={[s.filterChip, selectedMonth === -1 && s.filterChipActive]}
          onPress={() => setSelectedMonth(-1)}
        >
          <Text style={[s.filterChipText, selectedMonth === -1 && s.filterChipTextActive]}>
            Todos
          </Text>
        </Pressable>
        {[0, 1, 2, 3].map((offset) => {
          const month = (currentMonth - offset + 12) % 12;
          return (
            <Pressable
              key={month}
              style={[s.filterChip, selectedMonth === month && s.filterChipActive]}
              onPress={() => setSelectedMonth(month)}
            >
              <Text style={[s.filterChipText, selectedMonth === month && s.filterChipTextActive]}>
                {MONTHS_PT[month].slice(0, 3)}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Results count */}
      <Text style={s.resultsCount}>
        {filtered.length} {filtered.length === 1 ? 'transação' : 'transações'}
      </Text>
    </View>
  );

  return (
    <ScreenContainer containerClassName="bg-background">
      {/* Header */}
      <View style={s.header}>
        <Text style={s.title}>Transações</Text>
        <Pressable
          style={({ pressed }) => [s.addButton, pressed && s.pressed]}
          onPress={() => router.push('/transaction/add')}
        >
          <MaterialIcons name="add" size={22} color="#FFFFFF" />
        </Pressable>
      </View>

      {isLoading ? (
        <View style={s.loadingContainer}>
          {[1, 2, 3, 4, 5].map((i) => <SkeletonTransactionItem key={i} />)}
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TransactionItem
              transaction={item}
              onPress={() => router.push(`/transaction/${item.id}`)}
            />
          )}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={
            <EmptyState
              icon="receipt-long"
              title="Nenhuma transação"
              description={
                search || selectedType !== 'all' || selectedMonth !== -1
                  ? 'Nenhuma transação encontrada com os filtros selecionados.'
                  : 'Adicione sua primeira transação para começar.'
              }
              actionLabel={!search ? 'Adicionar transação' : undefined}
              onAction={() => router.push('/transaction/add')}
            />
          }
          contentContainerStyle={s.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
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
    pressed: {
      opacity: 0.8,
    },
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
      borderLeftWidth: 3,
    },
    summaryLabel: {
      fontSize: 11,
      color: colors.muted,
      fontWeight: '500',
      marginBottom: 4,
    },
    summaryValue: {
      fontSize: 16,
      fontWeight: '700',
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: 12,
      paddingHorizontal: 12,
      height: 44,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 12,
    },
    searchIcon: {
      marginRight: 8,
    },
    searchInput: {
      flex: 1,
      fontSize: 14,
      color: colors.foreground,
    },
    filterRow: {
      flexDirection: 'row',
      gap: 8,
      marginBottom: 8,
      flexWrap: 'wrap',
    },
    filterChip: {
      paddingHorizontal: 14,
      paddingVertical: 6,
      borderRadius: 999,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    filterChipActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    filterChipText: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.muted,
    },
    filterChipTextActive: {
      color: '#FFFFFF',
    },
    resultsCount: {
      fontSize: 12,
      color: colors.muted,
      marginBottom: 12,
      marginTop: 4,
    },
    listContent: {
      paddingHorizontal: 20,
      paddingBottom: 100,
    },
    loadingContainer: {
      paddingHorizontal: 20,
    },
  });
