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
import { useGoals } from '@/hooks/useGoals';

export default function AddGoalScreen() {
  const colors = useColors();
  const { createGoal } = useGoals();

  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('0');
  const [deadline, setDeadline] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!title.trim()) e.title = 'Título é obrigatório';
    if (!targetAmount || parseFloat(targetAmount.replace(',', '.')) <= 0)
      e.targetAmount = 'Valor da meta inválido';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setIsLoading(true);
    try {
      await createGoal({
        title: title.trim(),
        target_amount: parseFloat(targetAmount.replace(',', '.')),
        current_amount: parseFloat(currentAmount.replace(',', '.')) || 0,
        deadline: deadline || undefined,
      });
      router.back();
    } catch (err: any) {
      Alert.alert('Erro', err?.message ?? 'Não foi possível criar a meta.');
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
        <Text style={s.headerTitle}>Nova Meta</Text>
        <Pressable
          style={({ pressed }) => [s.saveButton, pressed && s.pressed, isLoading && s.disabled]}
          onPress={handleSave}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={s.saveButtonText}>Criar</Text>
          )}
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={s.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Icon */}
        <View style={s.iconSection}>
          <View style={[s.goalIcon, { backgroundColor: colors.primary + '15' }]}>
            <MaterialIcons name="flag" size={40} color={colors.primary} />
          </View>
          <Text style={s.iconHint}>Defina sua meta financeira</Text>
        </View>

        {/* Title */}
        <View style={s.field}>
          <Text style={s.label}>Nome da meta *</Text>
          <View style={[s.inputContainer, errors.title ? s.inputError : null]}>
            <TextInput
              style={s.input}
              placeholder="Ex: Viagem, Reserva de emergência..."
              placeholderTextColor={colors.muted}
              value={title}
              onChangeText={(v) => { setTitle(v); setErrors((e) => ({ ...e, title: '' })); }}
            />
          </View>
          {errors.title ? <Text style={s.errorText}>{errors.title}</Text> : null}
        </View>

        {/* Target Amount */}
        <View style={s.field}>
          <Text style={s.label}>Valor da meta (R$) *</Text>
          <View style={[s.inputContainer, errors.targetAmount ? s.inputError : null]}>
            <Text style={s.prefix}>R$</Text>
            <TextInput
              style={[s.input, { marginLeft: 8 }]}
              placeholder="0,00"
              placeholderTextColor={colors.muted}
              value={targetAmount}
              onChangeText={(v) => { setTargetAmount(v); setErrors((e) => ({ ...e, targetAmount: '' })); }}
              keyboardType="decimal-pad"
            />
          </View>
          {errors.targetAmount ? <Text style={s.errorText}>{errors.targetAmount}</Text> : null}
        </View>

        {/* Current Amount */}
        <View style={s.field}>
          <Text style={s.label}>Valor já economizado (R$)</Text>
          <View style={s.inputContainer}>
            <Text style={s.prefix}>R$</Text>
            <TextInput
              style={[s.input, { marginLeft: 8 }]}
              placeholder="0,00"
              placeholderTextColor={colors.muted}
              value={currentAmount}
              onChangeText={setCurrentAmount}
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        {/* Deadline */}
        <View style={s.field}>
          <Text style={s.label}>Prazo (opcional)</Text>
          <View style={s.inputContainer}>
            <MaterialIcons name="calendar-today" size={18} color={colors.muted} style={{ marginRight: 8 }} />
            <TextInput
              style={s.input}
              placeholder="AAAA-MM-DD"
              placeholderTextColor={colors.muted}
              value={deadline}
              onChangeText={setDeadline}
            />
          </View>
        </View>

        {/* Tips */}
        <View style={s.tipCard}>
          <MaterialIcons name="lightbulb" size={18} color={colors.warning} />
          <Text style={s.tipText}>
            Dica: Defina metas realistas e acompanhe seu progresso regularmente para manter a motivação.
          </Text>
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
    headerTitle: { fontSize: 17, fontWeight: '700', color: colors.foreground },
    saveButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      minWidth: 70,
      alignItems: 'center',
    },
    saveButtonText: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
    pressed: { opacity: 0.8 },
    disabled: { opacity: 0.6 },
    content: { padding: 20, paddingBottom: 60 },
    iconSection: { alignItems: 'center', marginBottom: 28 },
    goalIcon: {
      width: 88,
      height: 88,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
    },
    iconHint: { fontSize: 14, color: colors.muted },
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
      height: 52,
    },
    inputError: { borderColor: colors.error },
    prefix: { fontSize: 15, color: colors.muted, fontWeight: '600' },
    input: { flex: 1, fontSize: 15, color: colors.foreground },
    errorText: { fontSize: 12, color: colors.error, marginTop: 4 },
    tipCard: {
      flexDirection: 'row',
      backgroundColor: colors.warning + '10',
      borderRadius: 12,
      padding: 14,
      gap: 10,
      borderWidth: 1,
      borderColor: colors.warning + '30',
    },
    tipText: { flex: 1, fontSize: 13, color: colors.foreground, lineHeight: 18 },
  });
