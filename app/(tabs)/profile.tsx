import {
  View,
  Text,
  Pressable,
  ScrollView,
  Alert,
  StyleSheet,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { useAuthStore, useTransactionsStore, useGoalsStore, useSettingsStore } from '@/store';
import { useAppAuth } from '@/hooks/useAppAuth';
import { useTransactionSummary, formatCurrency } from '@/hooks/useFinance';

export default function ProfileScreen() {
  const colors = useColors();
  const { user } = useAuthStore();
  const { transactions } = useTransactionsStore();
  const { goals } = useGoalsStore();
  const { isDarkMode, setDarkMode } = useSettingsStore();
  const { signOut } = useAppAuth();

  const { totalIncome, totalExpense, balance } = useTransactionSummary(transactions);
  const completedGoals = goals.filter((g) => g.current_amount >= g.target_amount).length;

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : 'U';

  const handleLogout = () => {
    Alert.alert('Sair da conta', 'Deseja realmente sair?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          await signOut();
          router.replace('/(auth)');
        },
      },
    ]);
  };

  const s = styles(colors);

  return (
    <ScreenContainer containerClassName="bg-background">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.content}>
        {/* Header */}
        <View style={s.header}>
          <Text style={s.title}>Perfil</Text>
          <Pressable
            style={s.settingsButton}
            onPress={() => router.push('/settings')}
          >
            <MaterialIcons name="settings" size={22} color={colors.foreground} />
          </Pressable>
        </View>

        {/* User Card */}
        <View style={s.userCard}>
          <View style={s.avatarContainer}>
            <Text style={s.avatarText}>{initials}</Text>
          </View>
          <Text style={s.userName}>{user?.name ?? 'Usuário'}</Text>
          <Text style={s.userEmail}>{user?.email ?? ''}</Text>
          {user?.id === 'demo-user' && (
            <View style={s.demoBadge}>
              <Text style={s.demoBadgeText}>Modo Demo</Text>
            </View>
          )}
        </View>

        {/* Financial Summary */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Resumo Financeiro</Text>
          <View style={s.statsGrid}>
            <View style={s.statCard}>
              <Text style={[s.statValue, { color: colors.income }]}>{formatCurrency(totalIncome)}</Text>
              <Text style={s.statLabel}>Total Receitas</Text>
            </View>
            <View style={s.statCard}>
              <Text style={[s.statValue, { color: colors.expense }]}>{formatCurrency(totalExpense)}</Text>
              <Text style={s.statLabel}>Total Despesas</Text>
            </View>
            <View style={s.statCard}>
              <Text style={[s.statValue, { color: balance >= 0 ? colors.income : colors.expense }]}>
                {formatCurrency(balance)}
              </Text>
              <Text style={s.statLabel}>Saldo</Text>
            </View>
            <View style={s.statCard}>
              <Text style={[s.statValue, { color: colors.primary }]}>{completedGoals}/{goals.length}</Text>
              <Text style={s.statLabel}>Metas</Text>
            </View>
          </View>
        </View>

        {/* Settings */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Configurações</Text>
          <View style={s.menuCard}>
            {/* Dark Mode Toggle */}
            <Pressable
              style={s.menuItem}
              onPress={() => setDarkMode(!isDarkMode)}
            >
              <View style={[s.menuIconContainer, { backgroundColor: colors.primary + '15' }]}>
                <MaterialIcons
                  name={isDarkMode ? 'dark-mode' : 'light-mode'}
                  size={20}
                  color={colors.primary}
                />
              </View>
              <Text style={s.menuLabel}>Tema {isDarkMode ? 'Escuro' : 'Claro'}</Text>
              <View style={[s.toggle, isDarkMode && s.toggleActive]}>
                <View style={[s.toggleThumb, isDarkMode && s.toggleThumbActive]} />
              </View>
            </Pressable>

            <View style={s.menuDivider} />

            <Pressable
              style={s.menuItem}
              onPress={() => router.push('/settings')}
            >
              <View style={[s.menuIconContainer, { backgroundColor: colors.muted + '20' }]}>
                <MaterialIcons name="notifications" size={20} color={colors.muted} />
              </View>
              <Text style={s.menuLabel}>Notificações</Text>
              <MaterialIcons name="chevron-right" size={20} color={colors.muted} />
            </Pressable>

            <View style={s.menuDivider} />

            <Pressable
              style={s.menuItem}
              onPress={() => router.push('/settings')}
            >
              <View style={[s.menuIconContainer, { backgroundColor: colors.muted + '20' }]}>
                <MaterialIcons name="share" size={20} color={colors.muted} />
              </View>
              <Text style={s.menuLabel}>Exportar dados</Text>
              <MaterialIcons name="chevron-right" size={20} color={colors.muted} />
            </Pressable>

            <View style={s.menuDivider} />

            <Pressable
              style={s.menuItem}
              onPress={() => router.push('/settings')}
            >
              <View style={[s.menuIconContainer, { backgroundColor: colors.muted + '20' }]}>
                <MaterialIcons name="lock" size={20} color={colors.muted} />
              </View>
              <Text style={s.menuLabel}>Segurança</Text>
              <MaterialIcons name="chevron-right" size={20} color={colors.muted} />
            </Pressable>
          </View>
        </View>

        {/* Logout */}
        <Pressable
          style={({ pressed }) => [s.logoutButton, pressed && s.pressed]}
          onPress={handleLogout}
        >
          <MaterialIcons name="logout" size={20} color={colors.error} />
          <Text style={s.logoutText}>Sair da conta</Text>
        </Pressable>

        <Text style={s.version}>FinanceApp v1.0.0</Text>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = (colors: ReturnType<typeof useColors>) =>
  StyleSheet.create({
    content: {
      paddingBottom: 100,
    },
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
    settingsButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    userCard: {
      alignItems: 'center',
      paddingVertical: 24,
      paddingHorizontal: 20,
      marginHorizontal: 20,
      backgroundColor: colors.surface,
      borderRadius: 20,
      marginBottom: 24,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 3,
    },
    avatarContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    avatarText: {
      fontSize: 28,
      fontWeight: '800',
      color: '#FFFFFF',
    },
    userName: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.foreground,
      marginBottom: 4,
    },
    userEmail: {
      fontSize: 14,
      color: colors.muted,
    },
    demoBadge: {
      marginTop: 8,
      backgroundColor: colors.warning + '20',
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 999,
    },
    demoBadgeText: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.warning,
    },
    section: {
      paddingHorizontal: 20,
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 17,
      fontWeight: '700',
      color: colors.foreground,
      marginBottom: 12,
    },
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    statCard: {
      width: '47%',
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    statValue: {
      fontSize: 18,
      fontWeight: '800',
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 12,
      color: colors.muted,
      fontWeight: '500',
    },
    menuCard: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 3,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 14,
      paddingHorizontal: 16,
    },
    menuIconContainer: {
      width: 36,
      height: 36,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    menuLabel: {
      flex: 1,
      fontSize: 15,
      fontWeight: '500',
      color: colors.foreground,
    },
    menuDivider: {
      height: 1,
      backgroundColor: colors.border,
      marginLeft: 64,
    },
    toggle: {
      width: 44,
      height: 24,
      borderRadius: 12,
      backgroundColor: colors.border,
      justifyContent: 'center',
      paddingHorizontal: 2,
    },
    toggleActive: {
      backgroundColor: colors.primary,
    },
    toggleThumb: {
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: '#FFFFFF',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 2,
    },
    toggleThumbActive: {
      transform: [{ translateX: 20 }],
    },
    logoutButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      marginHorizontal: 20,
      paddingVertical: 14,
      borderRadius: 12,
      borderWidth: 1.5,
      borderColor: colors.error + '50',
      backgroundColor: colors.error + '08',
      marginBottom: 16,
    },
    logoutText: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.error,
    },
    pressed: {
      opacity: 0.75,
    },
    version: {
      textAlign: 'center',
      fontSize: 12,
      color: colors.muted,
      paddingBottom: 8,
    },
  });
