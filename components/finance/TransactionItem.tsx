import { View, Text, Pressable, StyleSheet } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useColors } from '@/hooks/use-colors';
import { getCategoryById } from '@/constants/finance';
import { formatCurrency, formatDate } from '@/hooks/useFinance';
import type { Transaction } from '@/types';

interface TransactionItemProps {
  transaction: Transaction;
  onPress?: () => void;
}

export function TransactionItem({ transaction, onPress }: TransactionItemProps) {
  const colors = useColors();
  const category = getCategoryById(transaction.category);
  const isIncome = transaction.type === 'income';

  const s = styles(colors);

  return (
    <Pressable
      style={({ pressed }) => [s.container, pressed && s.pressed]}
      onPress={onPress}
    >
      {/* Category Icon */}
      <View style={[s.iconContainer, { backgroundColor: category.color + '20' }]}>
        <MaterialIcons name={category.icon as any} size={20} color={category.color} />
      </View>

      {/* Info */}
      <View style={s.info}>
        <Text style={s.title} numberOfLines={1}>{transaction.title}</Text>
        <Text style={s.category}>{category.label} · {formatDate(transaction.date)}</Text>
      </View>

      {/* Amount */}
      <Text style={[s.amount, { color: isIncome ? colors.income : colors.expense }]}>
        {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
      </Text>
    </Pressable>
  );
}

const styles = (colors: ReturnType<typeof useColors>) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      backgroundColor: colors.surface,
      borderRadius: 12,
      marginBottom: 8,
    },
    pressed: {
      opacity: 0.75,
    },
    iconContainer: {
      width: 44,
      height: 44,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    info: {
      flex: 1,
    },
    title: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.foreground,
      marginBottom: 2,
    },
    category: {
      fontSize: 12,
      color: colors.muted,
    },
    amount: {
      fontSize: 15,
      fontWeight: '700',
    },
  });
