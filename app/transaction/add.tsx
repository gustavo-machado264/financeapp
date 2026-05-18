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
import { router } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useColors } from '@/hooks/use-colors';
import { useTransactions } from '@/hooks/useTransactions';
import { CATEGORIES, INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '@/constants/finance';
import type { TransactionType } from '@/constants/finance';

export default function AddTransactionScreen() {
  const colors = useColors();
  const { createTransaction } = useTransactions();

  const [type, setType] = useState<TransactionType>('expense');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const availableCategories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!title.trim()) e.title = 'Título é obrigatório';
    if (!amount || isNaN(parseFloat(amount.replace(',', '.'))) || parseFloat(amount.replace(',', '.')) <= 0)
      e.amount = 'Valor inválido';
    if (!category) e.category = 'Selecione uma categoria';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setIsLoading(true);
    try {
      await createTransaction({
        type,
        title: title.trim(),
        amount: parseFloat(amount.replace(',', '.')),
        category: category as any,
        description: description.trim() || undefined,
        date,
      });
      router.back();
    } catch (err: any) {
      Alert.alert('Erro', err?.message ?? 'Não foi possível salvar a transação.');
    } finally {
      setIsLoading(false);
    }
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
        <Text style={s.headerTitle}>Nova Transação</Text>
        <Pressable
          style={({ pressed }) => [s.saveButton, pressed && s.pressed, isLoading && s.disabled]}
          onPress={handleSave}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={s.saveButtonText}>Salvar</Text>
          )}
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={s.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Type Toggle */}
        <View style={s.typeToggle}>
          <Pressable
            style={[s.typeButton, type === 'expense' && s.typeButtonExpense]}
            onPress={() => { setType('expense'); setCategory(''); }}
          >
            <MaterialIcons
              name="arrow-downward"
              size={18}
              color={type === 'expense' ? '#fff' : colors.muted}
            />
            <Text style={[s.typeButtonText, type === 'expense' && s.typeButtonTextActive]}>
              Despesa
            </Text>
          </Pressable>
          <Pressable
            style={[s.typeButton, type === 'income' && s.typeButtonIncome]}
            onPress={() => { setType('income'); setCategory(''); }}
          >
            <MaterialIcons
              name="arrow-upward"
              size={18}
              color={type === 'income' ? '#fff' : colors.muted}
            />
            <Text style={[s.typeButtonText, type === 'income' && s.typeButtonTextActive]}>
              Receita
            </Text>
          </Pressable>
        </View>

        {/* Amount */}
        <View style={s.amountContainer}>
          <Text style={s.currencySymbol}>R$</Text>
          <TextInput
            style={[s.amountInput, errors.amount ? { color: colors.error } : null]}
            placeholder="0,00"
            placeholderTextColor={colors.muted}
            value={amount}
            onChangeText={(v) => { setAmount(v); setErrors((e) => ({ ...e, amount: '' })); }}
            keyboardType="decimal-pad"
          />
        </View>
        {errors.amount ? <Text style={s.errorText}>{errors.amount}</Text> : null}

        {/* Title */}
        <View style={s.field}>
          <Text style={s.label}>Título *</Text>
          <View style={[s.inputContainer, errors.title ? s.inputError : null]}>
            <TextInput
              style={s.input}
              placeholder="Ex: Almoço, Salário..."
              placeholderTextColor={colors.muted}
              value={title}
              onChangeText={(v) => { setTitle(v); setErrors((e) => ({ ...e, title: '' })); }}
            />
          </View>
          {errors.title ? <Text style={s.errorText}>{errors.title}</Text> : null}
        </View>

        {/* Category */}
        <View style={s.field}>
          <Text style={s.label}>Categoria *</Text>
          {errors.category ? <Text style={s.errorText}>{errors.category}</Text> : null}
          <View style={s.categoryGrid}>
            {availableCategories.map((cat) => (
              <Pressable
                key={cat.id}
                style={[
                  s.categoryChip,
                  category === cat.id && { backgroundColor: cat.color + '20', borderColor: cat.color },
                ]}
                onPress={() => { setCategory(cat.id); setErrors((e) => ({ ...e, category: '' })); }}
              >
                <MaterialIcons
                  name={cat.icon as any}
                  size={16}
                  color={category === cat.id ? cat.color : colors.muted}
                />
                <Text
                  style={[
                    s.categoryChipText,
                    category === cat.id && { color: cat.color, fontWeight: '600' },
                  ]}
                >
                  {cat.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Date */}
        <View style={s.field}>
          <Text style={s.label}>Data</Text>
          <View style={s.inputContainer}>
            <TextInput
              style={s.input}
              placeholder="AAAA-MM-DD"
              placeholderTextColor={colors.muted}
              value={date}
              onChangeText={setDate}
            />
          </View>
        </View>

        {/* Description */}
        <View style={s.field}>
          <Text style={s.label}>Descrição (opcional)</Text>
          <View style={[s.inputContainer, { height: 80, alignItems: 'flex-start', paddingTop: 12 }]}>
            <TextInput
              style={[s.input, { height: 60 }]}
              placeholder="Adicione uma nota..."
              placeholderTextColor={colors.muted}
              value={description}
              onChangeText={setDescription}
              multiline
              textAlignVertical="top"
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

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
    headerTitle: {
      fontSize: 17,
      fontWeight: '700',
      color: colors.foreground,
    },
    saveButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      minWidth: 70,
      alignItems: 'center',
    },
    saveButtonText: {
      fontSize: 14,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    pressed: {
      opacity: 0.8,
    },
    disabled: {
      opacity: 0.6,
    },
    content: {
      padding: 20,
      paddingBottom: 60,
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
    typeButtonExpense: {
      backgroundColor: colors.expense,
    },
    typeButtonIncome: {
      backgroundColor: colors.income,
    },
    typeButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.muted,
    },
    typeButtonTextActive: {
      color: '#FFFFFF',
    },
    amountContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 8,
    },
    currencySymbol: {
      fontSize: 28,
      fontWeight: '700',
      color: colors.muted,
      marginRight: 8,
    },
    amountInput: {
      fontSize: 48,
      fontWeight: '700',
      color: colors.foreground,
      minWidth: 120,
      textAlign: 'center',
    },
    field: {
      marginBottom: 20,
    },
    label: {
      fontSize: 13,
      fontWeight: '600',
      color: colors.foreground,
      marginBottom: 8,
    },
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
    inputError: {
      borderColor: colors.error,
    },
    input: {
      flex: 1,
      fontSize: 15,
      color: colors.foreground,
    },
    errorText: {
      fontSize: 12,
      color: colors.error,
      marginTop: 4,
    },
    categoryGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
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
    categoryChipText: {
      fontSize: 12,
      color: colors.muted,
    },
  });
