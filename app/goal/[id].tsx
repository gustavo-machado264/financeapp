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
import { useGoalsStore } from '@/store';
import { useGoals } from '@/hooks/useGoals';
import { formatCurrency, formatDate } from '@/hooks/useFinance';

export default function GoalDetailScreen() {
  const colors = useColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { goals } = useGoalsStore();
  const { editGoal, deleteGoal } = useGoals();

  const goal = goals.find((g) => g.id === id);

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(goal?.title ?? '');
  const [targetAmount, setTargetAmount] = useState(goal?.target_amount.toString() ?? '');
  const [currentAmount, setCurrentAmount] = useState(goal?.current_amount.toString() ?? '');
  const [deadline, setDeadline] = useState(goal?.deadline ?? '');
  const [isLoading, setIsLoading] = useState(false);

  if (!goal) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Meta não encontrada</Text>
      </View>
    );
  }

  const progress = Math.min((goal.current_amount / goal.target_amount) * 100, 100);
  const remaining = goal.target_amount - goal.current_amount;
  const isCompleted = progress >= 100;

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await editGoal({
        id: goal.id,
        title: title.trim(),
        target_amount: parseFloat(targetAmount.replace(',', '.')),
        current_amount: parseFloat(currentAmount.replace(',', '.')),
        deadline: deadline || undefined,
      });
      setIsEditing(false);
    } catch (err: any) {
      Alert.alert('Erro', err?.message ?? 'Não foi possível salvar.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert('Excluir meta', `Deseja excluir "${goal.title}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          await deleteGoal(goal.id);
          router.back();
        },
      },
    ]);
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
        <Text style={s.headerTitle}>{isEditing ? 'Editar Meta' : 'Detalhes'}</Text>
        <View style={s.headerActions}>
          {isEditing ? (
            <Pressable
              style={({ pressed }) => [s.saveButton, pressed && s.pressed]}
              onPress={handleSave}
              disabled={isLoading}
            >
              {isLoading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={s.saveButtonText}>Salvar</Text>}
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

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {!isEditing ? (
          <View>
            {/* Hero */}
            <View style={[s.hero, { backgroundColor: isCompleted ? colors.income + '15' : colors.primary + '10' }]}>
              <View style={[s.heroIcon, { backgroundColor: isCompleted ? colors.income : colors.primary }]}>
                <MaterialIcons name={isCompleted ? 'emoji-events' : 'flag'} size={32} color="#fff" />
              </View>
              <Text style={s.heroTitle}>{goal.title}</Text>
              <Text style={[s.heroPercentage, { color: isCompleted ? colors.income : colors.primary }]}>
                {Math.round(progress)}%
              </Text>
              {isCompleted && (
                <View style={[s.completedBadge, { backgroundColor: colors.income }]}>
                  <Text style={s.completedText}>🎉 Meta Concluída!</Text>
                </View>
              )}
            </View>

            {/* Progress */}
            <View style={s.progressCard}>
              <View style={s.progressTrack}>
                <View
                  style={[
                    s.progressFill,
                    { width: `${progress}%`, backgroundColor: isCompleted ? colors.income : colors.primary },
                  ]}
                />
              </View>
              <View style={s.amountsRow}>
                <View>
                  <Text style={s.amountLabel}>Economizado</Text>
                  <Text style={[s.amountValue, { color: colors.income }]}>{formatCurrency(goal.current_amount)}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={s.amountLabel}>Meta</Text>
                  <Text style={s.amountValue}>{formatCurrency(goal.target_amount)}</Text>
                </View>
              </View>
              {!isCompleted && (
                <Text style={s.remainingText}>Faltam {formatCurrency(remaining)} para concluir</Text>
              )}
            </View>

            {/* Details */}
            {goal.deadline && (
              <View style={s.detailRow}>
                <MaterialIcons name="calendar-today" size={18} color={colors.primary} />
                <Text style={s.detailText}>Prazo: {formatDate(goal.deadline)}</Text>
              </View>
            )}
          </View>
        ) : (
          <View>
            <View style={s.field}>
              <Text style={s.label}>Nome da meta</Text>
              <View style={s.inputContainer}>
                <TextInput style={s.input} value={title} onChangeText={setTitle} placeholderTextColor={colors.muted} />
              </View>
            </View>
            <View style={s.field}>
              <Text style={s.label}>Valor da meta (R$)</Text>
              <View style={s.inputContainer}>
                <Text style={s.prefix}>R$</Text>
                <TextInput style={[s.input, { marginLeft: 8 }]} value={targetAmount} onChangeText={setTargetAmount} keyboardType="decimal-pad" placeholderTextColor={colors.muted} />
              </View>
            </View>
            <View style={s.field}>
              <Text style={s.label}>Valor atual (R$)</Text>
              <View style={s.inputContainer}>
                <Text style={s.prefix}>R$</Text>
                <TextInput style={[s.input, { marginLeft: 8 }]} value={currentAmount} onChangeText={setCurrentAmount} keyboardType="decimal-pad" placeholderTextColor={colors.muted} />
              </View>
            </View>
            <View style={s.field}>
              <Text style={s.label}>Prazo</Text>
              <View style={s.inputContainer}>
                <TextInput style={s.input} value={deadline} onChangeText={setDeadline} placeholder="AAAA-MM-DD" placeholderTextColor={colors.muted} />
              </View>
            </View>
          </View>
        )}
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
    closeButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center' },
    headerTitle: { fontSize: 17, fontWeight: '700', color: colors.foreground },
    headerActions: { flexDirection: 'row', alignItems: 'center' },
    saveButton: { backgroundColor: colors.primary, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, minWidth: 70, alignItems: 'center' },
    saveButtonText: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
    iconButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center' },
    pressed: { opacity: 0.8 },
    content: { padding: 20, paddingBottom: 60 },
    hero: { borderRadius: 20, padding: 24, alignItems: 'center', marginBottom: 20 },
    heroIcon: { width: 64, height: 64, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
    heroTitle: { fontSize: 20, fontWeight: '700', color: colors.foreground, marginBottom: 8, textAlign: 'center' },
    heroPercentage: { fontSize: 48, fontWeight: '800' },
    completedBadge: { borderRadius: 999, paddingHorizontal: 16, paddingVertical: 6, marginTop: 8 },
    completedText: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
    progressCard: { backgroundColor: colors.surface, borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
    progressTrack: { height: 8, backgroundColor: colors.border, borderRadius: 4, overflow: 'hidden', marginBottom: 16 },
    progressFill: { height: '100%', borderRadius: 4 },
    amountsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    amountLabel: { fontSize: 11, color: colors.muted, marginBottom: 2 },
    amountValue: { fontSize: 16, fontWeight: '700', color: colors.foreground },
    remainingText: { fontSize: 12, color: colors.muted, textAlign: 'center' },
    detailRow: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.surface, borderRadius: 12, padding: 14 },
    detailText: { fontSize: 14, color: colors.foreground, fontWeight: '500' },
    field: { marginBottom: 20 },
    label: { fontSize: 13, fontWeight: '600', color: colors.foreground, marginBottom: 8 },
    inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 14, height: 52 },
    prefix: { fontSize: 15, color: colors.muted, fontWeight: '600' },
    input: { flex: 1, fontSize: 15, color: colors.foreground },
  });
