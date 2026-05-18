import { View, Text, Pressable, StyleSheet } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useColors } from '@/hooks/use-colors';
import { useSettingsStore } from '@/store';
import { formatCurrency } from '@/hooks/useFinance';

interface BalanceCardProps {
  balance: number;
  totalIncome: number;
  totalExpense: number;
  userName?: string;
}

export function BalanceCard({ balance, totalIncome, totalExpense, userName }: BalanceCardProps) {
  const colors = useColors();
  const { hideBalance, setHideBalance } = useSettingsStore();

  const s = styles(colors);
  const greeting = getGreeting();

  return (
    <View style={s.card}>
      {/* Greeting */}
      <View style={s.greetingRow}>
        <Text style={s.greeting}>
          {greeting}, {userName?.split(' ')[0] ?? 'Usuário'} 👋
        </Text>
        <Pressable
          onPress={() => setHideBalance(!hideBalance)}
          style={s.eyeButton}
          hitSlop={8}
        >
          <MaterialIcons
            name={hideBalance ? 'visibility-off' : 'visibility'}
            size={20}
            color="rgba(255,255,255,0.8)"
          />
        </Pressable>
      </View>

      {/* Balance */}
      <Text style={s.balanceLabel}>Saldo total</Text>
      <Text style={s.balanceAmount}>
        {hideBalance ? '••••••' : formatCurrency(balance)}
      </Text>

      {/* Income / Expense Row */}
      <View style={s.summaryRow}>
        <View style={s.summaryItem}>
          <View style={s.summaryIconRow}>
            <View style={[s.summaryIcon, { backgroundColor: 'rgba(22,163,74,0.2)' }]}>
              <MaterialIcons name="arrow-upward" size={14} color="#4ADE80" />
            </View>
            <Text style={s.summaryLabel}>Receitas</Text>
          </View>
          <Text style={s.summaryAmount}>
            {hideBalance ? '••••' : formatCurrency(totalIncome)}
          </Text>
        </View>

        <View style={s.divider} />

        <View style={s.summaryItem}>
          <View style={s.summaryIconRow}>
            <View style={[s.summaryIcon, { backgroundColor: 'rgba(220,38,38,0.2)' }]}>
              <MaterialIcons name="arrow-downward" size={14} color="#F87171" />
            </View>
            <Text style={s.summaryLabel}>Despesas</Text>
          </View>
          <Text style={s.summaryAmount}>
            {hideBalance ? '••••' : formatCurrency(totalExpense)}
          </Text>
        </View>
      </View>
    </View>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  return 'Boa noite';
}

const styles = (colors: ReturnType<typeof useColors>) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.primary,
      borderRadius: 20,
      padding: 20,
      marginHorizontal: 20,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.35,
      shadowRadius: 16,
      elevation: 10,
    },
    greetingRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    greeting: {
      fontSize: 14,
      color: 'rgba(255,255,255,0.85)',
      fontWeight: '500',
    },
    eyeButton: {
      padding: 4,
    },
    balanceLabel: {
      fontSize: 12,
      color: 'rgba(255,255,255,0.7)',
      fontWeight: '500',
      marginBottom: 4,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
    },
    balanceAmount: {
      fontSize: 34,
      fontWeight: '700',
      color: '#FFFFFF',
      letterSpacing: -0.5,
      marginBottom: 20,
    },
    summaryRow: {
      flexDirection: 'row',
      backgroundColor: 'rgba(255,255,255,0.12)',
      borderRadius: 12,
      padding: 12,
    },
    summaryItem: {
      flex: 1,
    },
    summaryIconRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
    },
    summaryIcon: {
      width: 22,
      height: 22,
      borderRadius: 11,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 6,
    },
    summaryLabel: {
      fontSize: 11,
      color: 'rgba(255,255,255,0.7)',
      fontWeight: '500',
    },
    summaryAmount: {
      fontSize: 15,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    divider: {
      width: 1,
      backgroundColor: 'rgba(255,255,255,0.2)',
      marginHorizontal: 12,
    },
  });
