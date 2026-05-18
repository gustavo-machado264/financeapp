import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { useColors } from '@/hooks/use-colors';
import { useAppAuth } from '@/hooks/useAppAuth';

export default function ForgotPasswordScreen() {
  const colors = useColors();
  const { resetPassword } = useAppAuth();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleReset = async () => {
    if (!email.trim()) { setError('E-mail é obrigatório'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('E-mail inválido'); return; }

    setIsLoading(true);
    try {
      await resetPassword(email.trim());
      setSent(true);
    } catch (err: any) {
      Alert.alert('Erro', err?.message ?? 'Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const s = styles(colors);

  if (sent) {
    return (
      <View style={[s.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={s.successIcon}>✉️</Text>
        <Text style={s.successTitle}>E-mail enviado!</Text>
        <Text style={s.successText}>
          Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
        </Text>
        <Pressable style={s.backToLoginButton} onPress={() => router.replace('/(auth)')}>
          <Text style={s.backToLoginText}>Voltar ao login</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={s.container}>
        <Pressable style={s.backButton} onPress={() => router.back()}>
          <Text style={s.backText}>← Voltar</Text>
        </Pressable>

        <Text style={s.title}>Recuperar senha</Text>
        <Text style={s.subtitle}>
          Digite seu e-mail e enviaremos um link para redefinir sua senha.
        </Text>

        <View style={s.fieldGroup}>
          <Text style={s.label}>E-mail</Text>
          <View style={[s.inputContainer, error ? s.inputError : null]}>
            <TextInput
              style={s.input}
              placeholder="seu@email.com"
              placeholderTextColor={colors.muted}
              value={email}
              onChangeText={(v) => { setEmail(v); setError(''); }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={handleReset}
            />
          </View>
          {error ? <Text style={s.errorText}>{error}</Text> : null}
        </View>

        <Pressable
          style={({ pressed }) => [s.resetButton, pressed && s.buttonPressed, isLoading && s.buttonDisabled]}
          onPress={handleReset}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={s.resetButtonText}>Enviar link de recuperação</Text>
          )}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = (colors: ReturnType<typeof useColors>) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 24,
      paddingTop: 60,
      backgroundColor: colors.background,
    },
    backButton: {
      marginBottom: 32,
    },
    backText: {
      fontSize: 15,
      color: colors.primary,
      fontWeight: '500',
    },
    title: {
      fontSize: 28,
      fontWeight: '700',
      color: colors.foreground,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 15,
      color: colors.muted,
      marginBottom: 32,
      lineHeight: 22,
    },
    fieldGroup: {
      marginBottom: 24,
    },
    label: {
      fontSize: 13,
      fontWeight: '600',
      color: colors.foreground,
      marginBottom: 6,
    },
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
    resetButton: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      height: 52,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    resetButtonText: {
      fontSize: 16,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    buttonPressed: {
      opacity: 0.8,
      transform: [{ scale: 0.98 }],
    },
    buttonDisabled: {
      opacity: 0.6,
    },
    successIcon: {
      fontSize: 64,
      marginBottom: 24,
    },
    successTitle: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.foreground,
      marginBottom: 12,
    },
    successText: {
      fontSize: 15,
      color: colors.muted,
      textAlign: 'center',
      lineHeight: 22,
      marginBottom: 32,
      paddingHorizontal: 24,
    },
    backToLoginButton: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      height: 52,
      paddingHorizontal: 32,
      alignItems: 'center',
      justifyContent: 'center',
    },
    backToLoginText: {
      fontSize: 16,
      fontWeight: '700',
      color: '#FFFFFF',
    },
  });
