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
import { useColors } from '@/hooks/use-colors';
import { useAppAuth } from '@/hooks/useAppAuth';

export default function RegisterScreen() {
  const colors = useColors();
  const { signUp, isLoading } = useAppAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Nome é obrigatório';
    if (!email.trim()) e.email = 'E-mail é obrigatório';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'E-mail inválido';
    if (!password) e.password = 'Senha é obrigatória';
    else if (password.length < 6) e.password = 'Mínimo 6 caracteres';
    if (password !== confirmPassword) e.confirmPassword = 'Senhas não coincidem';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    try {
      await signUp(name.trim(), email.trim(), password);
      router.replace('/(tabs)');
    } catch (err: any) {
      Alert.alert('Erro ao criar conta', err?.message ?? 'Tente novamente.');
    }
  };

  const s = styles(colors);

  const renderField = (
    label: string,
    value: string,
    onChange: (v: string) => void,
    key: string,
    options?: {
      placeholder?: string;
      keyboardType?: 'email-address' | 'default';
      secure?: boolean;
      returnKeyType?: 'next' | 'done';
    }
  ) => (
    <View style={s.fieldGroup}>
      <Text style={s.label}>{label}</Text>
      <View style={[s.inputContainer, errors[key] ? s.inputError : null]}>
        <TextInput
          style={[s.input, { flex: 1 }]}
          placeholder={options?.placeholder ?? ''}
          placeholderTextColor={colors.muted}
          value={value}
          onChangeText={(v) => { onChange(v); setErrors((e) => ({ ...e, [key]: '' })); }}
          keyboardType={options?.keyboardType ?? 'default'}
          autoCapitalize={options?.keyboardType === 'email-address' ? 'none' : 'words'}
          autoCorrect={false}
          secureTextEntry={options?.secure && !showPassword}
          returnKeyType={options?.returnKeyType ?? 'next'}
        />
        {options?.secure && (
          <Pressable onPress={() => setShowPassword((v) => !v)} style={s.eyeButton}>
            <Text style={s.eyeIcon}>{showPassword ? '🙈' : '👁️'}</Text>
          </Pressable>
        )}
      </View>
      {errors[key] ? <Text style={s.errorText}>{errors[key]}</Text> : null}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={s.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Back Button */}
        <Pressable style={s.backButton} onPress={() => router.back()}>
          <Text style={s.backText}>← Voltar</Text>
        </Pressable>

        <Text style={s.title}>Criar conta</Text>
        <Text style={s.subtitle}>Comece a controlar suas finanças hoje</Text>

        <View style={s.form}>
          {renderField('Nome completo', name, setName, 'name', { placeholder: 'Seu nome' })}
          {renderField('E-mail', email, setEmail, 'email', {
            placeholder: 'seu@email.com',
            keyboardType: 'email-address',
          })}
          {renderField('Senha', password, setPassword, 'password', {
            placeholder: '••••••••',
            secure: true,
          })}
          {renderField('Confirmar senha', confirmPassword, setConfirmPassword, 'confirmPassword', {
            placeholder: '••••••••',
            secure: true,
            returnKeyType: 'done',
          })}

          <Pressable
            style={({ pressed }) => [s.registerButton, pressed && s.buttonPressed, isLoading && s.buttonDisabled]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={s.registerButtonText}>Criar conta</Text>
            )}
          </Pressable>

          <View style={s.loginRow}>
            <Text style={s.loginText}>Já tem conta? </Text>
            <Pressable onPress={() => router.back()}>
              <Text style={s.loginLink}>Entrar</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = (colors: ReturnType<typeof useColors>) =>
  StyleSheet.create({
    container: {
      flexGrow: 1,
      paddingHorizontal: 24,
      paddingTop: 60,
      paddingBottom: 40,
    },
    backButton: {
      marginBottom: 24,
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
    },
    form: {},
    fieldGroup: {
      marginBottom: 16,
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
      fontSize: 15,
      color: colors.foreground,
    },
    eyeButton: {
      padding: 4,
    },
    eyeIcon: {
      fontSize: 18,
    },
    errorText: {
      fontSize: 12,
      color: colors.error,
      marginTop: 4,
    },
    registerButton: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      height: 52,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 8,
      marginBottom: 16,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    registerButtonText: {
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
    loginRow: {
      flexDirection: 'row',
      justifyContent: 'center',
    },
    loginText: {
      fontSize: 14,
      color: colors.muted,
    },
    loginLink: {
      fontSize: 14,
      color: colors.primary,
      fontWeight: '600',
    },
  });
