import {
  View,
  Text,
  Pressable,
  ScrollView,
  Alert,
  StyleSheet,
  Switch,
} from 'react-native';
import { router } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { useSettingsStore, useTransactionsStore, useGoalsStore } from '@/store';
import { formatCurrency } from '@/hooks/useFinance';

export default function SettingsScreen() {
  const colors = useColors();
  const { isDarkMode, notificationsEnabled, hideBalance, setDarkMode, setNotifications, setHideBalance } =
    useSettingsStore();
  const { transactions } = useTransactionsStore();
  const { goals } = useGoalsStore();

  const handleExportData = () => {
    const data = {
      transactions,
      goals,
      exportedAt: new Date().toISOString(),
    };
    Alert.alert(
      'Exportar dados',
      `${transactions.length} transações e ${goals.length} metas serão exportadas.\n\nEm uma versão completa, os dados seriam exportados como CSV ou PDF.`,
      [{ text: 'OK' }]
    );
  };

  const s = styles(colors);

  const renderSection = (title: string, children: React.ReactNode) => (
    <View style={s.section}>
      <Text style={s.sectionTitle}>{title}</Text>
      <View style={s.sectionCard}>{children}</View>
    </View>
  );

  const renderToggleItem = (
    icon: string,
    iconColor: string,
    label: string,
    description: string,
    value: boolean,
    onChange: (v: boolean) => void
  ) => (
    <View style={s.settingItem}>
      <View style={[s.settingIcon, { backgroundColor: iconColor + '15' }]}>
        <MaterialIcons name={icon as any} size={20} color={iconColor} />
      </View>
      <View style={s.settingContent}>
        <Text style={s.settingLabel}>{label}</Text>
        <Text style={s.settingDescription}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: colors.border, true: colors.primary + '60' }}
        thumbColor={value ? colors.primary : colors.muted}
      />
    </View>
  );

  return (
    <ScreenContainer containerClassName="bg-background">
      {/* Header */}
      <View style={s.header}>
        <Pressable onPress={() => router.back()} style={s.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={colors.foreground} />
        </Pressable>
        <Text style={s.title}>Configurações</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.content}>
        {/* Appearance */}
        {renderSection('Aparência', (
          <>
            {renderToggleItem(
              'dark-mode',
              colors.primary,
              'Tema Escuro',
              'Ative para usar o tema escuro do aplicativo',
              isDarkMode,
              setDarkMode
            )}
          </>
        ))}

        {/* Privacy */}
        {renderSection('Privacidade', (
          <>
            {renderToggleItem(
              'visibility-off',
              colors.muted,
              'Ocultar saldo',
              'Oculta os valores financeiros na tela inicial',
              hideBalance,
              setHideBalance
            )}
          </>
        ))}

        {/* Notifications */}
        {renderSection('Notificações', (
          <>
            {renderToggleItem(
              'notifications',
              colors.warning,
              'Notificações',
              'Receba alertas sobre suas finanças',
              notificationsEnabled,
              setNotifications
            )}
          </>
        ))}

        {/* Data */}
        {renderSection('Dados', (
          <>
            <Pressable
              style={({ pressed }) => [s.settingItem, pressed && s.pressed]}
              onPress={handleExportData}
            >
              <View style={[s.settingIcon, { backgroundColor: colors.income + '15' }]}>
                <MaterialIcons name="share" size={20} color={colors.income} />
              </View>
              <View style={s.settingContent}>
                <Text style={s.settingLabel}>Exportar dados</Text>
                <Text style={s.settingDescription}>
                  {transactions.length} transações · {goals.length} metas
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={20} color={colors.muted} />
            </Pressable>
          </>
        ))}

        {/* Security */}
        {renderSection('Segurança', (
          <>
            <Pressable style={({ pressed }) => [s.settingItem, pressed && s.pressed]}>
              <View style={[s.settingIcon, { backgroundColor: colors.primary + '15' }]}>
                <MaterialIcons name="lock" size={20} color={colors.primary} />
              </View>
              <View style={s.settingContent}>
                <Text style={s.settingLabel}>Alterar senha</Text>
                <Text style={s.settingDescription}>Atualize sua senha de acesso</Text>
              </View>
              <MaterialIcons name="chevron-right" size={20} color={colors.muted} />
            </Pressable>
          </>
        ))}

        {/* About */}
        {renderSection('Sobre', (
          <>
            <View style={s.settingItem}>
              <View style={[s.settingIcon, { backgroundColor: colors.muted + '15' }]}>
                <MaterialIcons name="info" size={20} color={colors.muted} />
              </View>
              <View style={s.settingContent}>
                <Text style={s.settingLabel}>Versão</Text>
                <Text style={s.settingDescription}>FinanceApp 1.0.0</Text>
              </View>
            </View>
          </>
        ))}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = (colors: ReturnType<typeof useColors>) =>
  StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 12,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    title: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.foreground,
    },
    content: {
      paddingBottom: 100,
    },
    section: {
      paddingHorizontal: 20,
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.muted,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      marginBottom: 8,
    },
    sectionCard: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 3,
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 14,
      paddingHorizontal: 16,
    },
    settingIcon: {
      width: 36,
      height: 36,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    settingContent: {
      flex: 1,
    },
    settingLabel: {
      fontSize: 15,
      fontWeight: '500',
      color: colors.foreground,
      marginBottom: 2,
    },
    settingDescription: {
      fontSize: 12,
      color: colors.muted,
    },
    pressed: {
      opacity: 0.75,
    },
  });
