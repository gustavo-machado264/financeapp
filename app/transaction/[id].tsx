import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useColors } from '@/hooks/use-colors';
import { useTransactionsStore } from '@/store';
import { useTransactions } from '@/hooks/useTransactions';
import { getCategoryById, INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '@/constants/finance';
import { formatCurrency, formatDate } from '@/hooks/useFinance';
import type { TransactionType } from '@/constants/finance';

export default function TransactionDetailScreen() {
  const colors = useColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { transactions } = useTransactionsStore();
  const { editTransaction, deleteTransaction } = useTransactions();

  const transaction = transactions.find((t) => t.id === id);

  const [isEditing, setIsEditing] = useState(false);
  const [type, setType] = useState<TransactionType>(transaction?.type ?? 'expense');
  const [title, setTitle] = useState(transaction?.title ?? '');
  const [amount, setAmount] = useState(transaction?.amount.toString() ?? '');
  const [category, setCategory] = useState(transaction?.category ?? '');
  const [description, setDescription] = useState(transaction?.description ?? '');
  const [date, setDate] = useState(transaction?.date ?? '');
  const [isLoading, setIsLoading] = useState(false);

  if (!transaction) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Transação não encontrada</Text>
      </View>
    );
  }

  const cat = getCategoryById(transaction.category);
  const availableCategories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await editTransaction({
        id: transaction.id,
        type,
        title: title.trim(),
        amount: parseFloat(amount.replace(',', '.')),
        category: category as any,
        description: description.trim() || undefined,
        date,
      });
      setIsEditing(false);
    } catch (err: any) {
      Alert.alert('Erro', err?.message ?? 'Não foi possível salvar.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Excluir transação',
      `Deseja excluir "${transaction.title}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            await deleteTransaction(transaction.id);
            router.back();
          },
        },
      ]
    );
  };

  const s = styles(colors);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={s.header}>
        <Pressable onPress={() => router.back()} style={s.closeButton}>
          <MaterialIcons name="close" size={24} color={colors.foreground} />
        </Pressable>
        <Text style={s.headerTitle}>{isEditing ? 'Editar' : 'Detalhes'}</Text>
        <View style={s.headerActions}>
          {isEditing ? (
            <Pressable
              style={({ pressed }) => [s.saveButton, pressed && s.pressed]}
              onPress={handleSave}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={s.saveButtonText}>Salvar</Text>
              )}
            </Pressable>
          ) : (
            <>
              <Pressable style={s.iconButton} onPress={() => setIsEditing(true)}>
                <MaterialIcons name="edit" size={20} color={colors.primary} />
              </Pressable>
              <Pressable style={[s.iconButton, { marginLeft: 8 }]} onPress={handleDelete}>
                <MaterialIcons name="delete" size={20} color={colors.error} />
              </Pressable>
            </>
          )}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={s.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {!isEditing ? (
          // View Mode
          <View>
            {/* Amount Hero */}
            <View style={[s.amountHero, { backgroundColor: transaction.type === 'income' ? colors.income + '15' : colors.expense + '15' }]}>
              <View style={[s.amountIconContainer, { backgroundColor: transaction.type === 'income' ? colors.income : colors.expense }]}>
                <MaterialIcons
                  name={transaction.type === 'income' ? 'arrow-upward' : 'arrow-downward'}
                  size={24}
                  color="#fff"
                />
              </View>
              <Text style={[s.amountHeroValue, { color: transaction.type === 'income' ? colors.income : colors.expense }]}>
                {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
              </Text>
              <Text style={s.amountHeroTitle}>{transaction.title}</Text>
            </View>

            {/* Details */}
            <View style={s.detailCard}>
              <DetailRow label="Categoria" value={cat.label} icon={cat.icon} iconColor={cat.color} colors={colors} />
              <DetailRow label="Data" value={formatDate(transaction.date)} icon="calendar-today" iconColor={colors.primary} colors={colors} />
              <DetailRow label="Tipo" value={transaction.type === 'income' ? 'Receita' : 'Despesa'} icon={transaction.type === 'income' ? 'arrow-upward' : 'arrow-downward'} iconColor={transaction.type === 'income' ? colors.income : colors.expense} colors={colors} />
              {transaction.description && (
                <DetailRow label="Descrição" value={transaction.description} icon="description" iconColor={colors.muted} colors={colors} />
              )}
            </View>
          </View>
        ) : (
          // Edit Mode
          <View>
            {/* Type Toggle */}
            <View style={s.typeToggle}>
              <Pressable
                style={[s.typeButton, type === 'expense' && s.typeButtonExpense]}
                onPress={() => { setType('expense'); setCategory(''); }}
              >
                <MaterialIcons name="arrow-downward" size={18} color={type === 'expense' ? '#fff' : colors.muted} />
                <Text style={[s.typeButtonText, type === 'expense' && s.typeButtonTextActive]}>Despesa</Text>
              </Pressable>
              <Pressable
                style={[s.typeButton, type === 'income' && s.typeButtonIncome]}
                onPress={() => { setType('income'); setCategory(''); }}
              >
                <MaterialIcons name="arrow-upward" size={18} color={type === 'income' ? '#fff' : colors.muted} />
                <Text style={[s.typeButtonText, type === 'income' && s.typeButtonTextActive]}>Receita</Text>
              </Pressable>
            </View>

            {/* Amount */}
            <View style={s.amountContainer}>
              <Text style={s.currencySymbol}>R$</Text>
              <TextInput
                style={s.amountInput}
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
              />
            </View>

            {/* Title */}
            <View style={s.field}>
              <Text style={s.label}>Título</Text>
              <View style={s.inputContainer}>
                <TextInput style={s.input} value={title} onChangeText={setTitle} placeholderTextColor={colors.muted} />
              </View>
            </View>

            {/* Category */}
            <View style={s.field}>
              <Text style={s.label}>Categoria</Text>
              <View style={s.categoryGrid}>
                {availableCategories.map((cat) => (
                  <Pressable
                    key={cat.id}
                    style={[s.categoryChip, category === cat.id && { backgroundColor: cat.color + '20', borderColor: cat.color }]}
                    onPress={() => setCategory(cat.id)}
                  >
                    <MaterialIcons name={cat.icon as any} size={16} color={category === cat.id ? cat.color : colors.muted} />
                    <Text style={[s.categoryChipText, category === cat.id && { color: cat.color, fontWeight: '600' }]}>{cat.label}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Date */}
            <View style={s.field}>
              <Text style={s.label}>Data</Text>
              <View style={s.inputContainer}>
                <TextInput style={s.input} value={date} onChangeText={setDate} placeholderTextColor={colors.muted} />
              </View>
            </View>

            {/* Description */}
            <View style={s.field}>
              <Text style={s.label}>Descrição</Text>
              <View style={[s.inputContainer, { height: 80, alignItems: 'flex-start', paddingTop: 12 }]}>
                <TextInput style={[s.input, { height: 60 }]} value={description} onChangeText={setDescription} multiline textAlignVertical="top" placeholderTextColor={colors.muted} />
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function DetailRow({ label, value, icon, iconColor, colors }: any) {
  const s = detailStyles(colors);
  return (
    <View style={s.row}>
      <View style={[s.iconContainer, { backgroundColor: iconColor + '15' }]}>
        <MaterialIcons name={icon} size={18} color={iconColor} />
      </View>
      <View style={s.rowContent}>
        <Text style={s.rowLabel}>{label}</Text>
        <Text style={s.rowValue}>{value}</Text>
      </View>
    </View>
  );
}

const detailStyles = (colors: any) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    iconContainer: {
      width: 36,
      height: 36,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    rowContent: { flex: 1 },
    rowLabel: { fontSize: 11, color: colors.muted, marginBottom: 2 },
    rowValue: { fontSize: 14, fontWeight: '600', color: colors.foreground },
  });

const styles = (colors: ReturnType<typeof useColors>) =>
  StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingTop: Platform.OS === 'ios' ? 56 : 20,
      paddingBottom: 16,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    closeButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.surface2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: { fontSize: 17, fontWeight: '700', color: colors.foreground },
    headerActions: { flexDirection: 'row', alignItems: 'center' },
    saveButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      minWidth: 70,
      alignItems: 'center',
    },
    saveButtonText: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
    iconButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.surface2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    pressed: { opacity: 0.8 },
    content: { padding: 20, paddingBottom: 60 },
    amountHero: {
      borderRadius: 20,
      padding: 24,
      alignItems: 'center',
      marginBottom: 20,
    },
    amountIconContainer: {
      width: 52,
      height: 52,
      borderRadius: 26,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
    },
    amountHeroValue: { fontSize: 36, fontWeight: '800', marginBottom: 4 },
    amountHeroTitle: { fontSize: 16, color: colors.foreground, fontWeight: '600' },
    detailCard: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      paddingHorizontal: 16,
      overflow: 'hidden',
    },
    typeToggle: {
      flexDirection: 'row',
      backgroundColor: colors.surface2,
      borderRadius: 12,
      padding: 4,
      marginBottom: 24,
    },
    typeButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 10,
      borderRadius: 10,
      gap: 6,
    },
    typeButtonExpense: { backgroundColor: colors.expense },
    typeButtonIncome: { backgroundColor: colors.income },
    typeButtonText: { fontSize: 14, fontWeight: '600', color: colors.muted },
    typeButtonTextActive: { color: '#FFFFFF' },
    amountContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 24,
    },
    currencySymbol: { fontSize: 28, fontWeight: '700', color: colors.muted, marginRight: 8 },
    amountInput: {
      fontSize: 48,
      fontWeight: '700',
      color: colors.foreground,
      minWidth: 120,
      textAlign: 'center',
    },
    field: { marginBottom: 20 },
    label: { fontSize: 13, fontWeight: '600', color: colors.foreground, marginBottom: 8 },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderWidth: 1.5,
      borderColor: colors.border,
      borderRadius: 12,
      paddingHorizontal: 14,
      height: 48,
    },
    input: { flex: 1, fontSize: 15, color: colors.foreground },
    categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    categoryChip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 999,
      borderWidth: 1.5,
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },
    categoryChipText: { fontSize: 12, color: colors.muted },
  });
