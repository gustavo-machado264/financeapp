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
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { useColors } from '@/hooks/use-colors';
import { useAppAuth } from '@/hooks/useAppAuth';
import { useTransactionsStore, useGoalsStore, useAuthStore } from '@/store';
import { DEMO_USER, DEMO_TRANSACTIONS, DEMO_GOALS } from '@/utils/mockData';

export default function LoginScreen() {
  const colors = useColors();
  const { signIn, isLoading } = useAppAuth();
  const setTransactions = useTransactionsStore((s) => s.setTransactions);
  const setGoals = useGoalsStore((s) => s.setGoals);
  const setUser = useAuthStore((s) => s.setUser);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!email.trim()) newErrors.email = 'E-mail é obrigatório';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'E-mail inválido';
    if (!password) newErrors.password = 'Senha é obrigatória';
    else if (password.length < 6) newErrors.password = 'Mínimo 6 caracteres';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    try {
      await signIn(email.trim(), password);
      router.replace('/(tabs)');
    } catch (err: any) {
      Alert.alert('Erro ao entrar', err?.message ?? 'Verifique suas credenciais.');
    }
  };

  const handleDemoMode = () => {
    setUser(DEMO_USER);
    setTransactions(DEMO_TRANSACTIONS);
    setGoals(DEMO_GOALS);
    router.replace('/(tabs)');
  };

  const s = styles(colors);

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
        {/* Header */}
        <View style={s.header}>
          <View style={s.logoContainer}>
            <Image
              source={require('@/assets/images/icon.png')}
              style={s.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={s.appName}>FinanceApp</Text>
          <Text style={s.tagline}>Controle financeiro inteligente</Text>
        </View>

        {/* Form */}
        <View style={s.form}>
          <Text style={s.formTitle}>Entrar na conta</Text>

          {/* Email */}
          <View style={s.fieldGroup}>
            <Text style={s.label}>E-mail</Text>
            <View style={[s.inputContainer, errors.email ? s.inputError : null]}>
              <TextInput
                style={s.input}
                placeholder="seu@email.com"
                placeholderTextColor={colors.muted}
                value={email}
                onChangeText={(v) => { setEmail(v); setErrors((e) => ({ ...e, email: undefined })); }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
              />
            </View>
            {errors.email ? <Text style={s.errorText}>{errors.email}</Text> : null}
          </View>

          {/* Password */}
          <View style={s.fieldGroup}>
            <Text style={s.label}>Senha</Text>
            <View style={[s.inputContainer, errors.password ? s.inputError : null]}>
              <TextInput
                style={[s.input, { flex: 1 }]}
                placeholder="••••••••"
                placeholderTextColor={colors.muted}
                value={password}
                onChangeText={(v) => { setPassword(v); setErrors((e) => ({ ...e, password: undefined })); }}
                secureTextEntry={!showPassword}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />
              <Pressable
                onPress={() => setShowPassword((v) => !v)}
                style={s.eyeButton}
              >
                <Text style={s.eyeIcon}>{showPassword ? '🙈' : '👁️'}</Text>
              </Pressable>
            </View>
            {errors.password ? <Text style={s.errorText}>{errors.password}</Text> : null}
          </View>

          {/* Forgot Password */}
          <Pressable
            onPress={() => router.push('/(auth)/forgot-password')}
            style={s.forgotButton}
          >
            <Text style={s.forgotText}>Esqueci minha senha</Text>
          </Pressable>

          {/* Login Button */}
          <Pressable
            style={({ pressed }) => [s.loginButton, pressed && s.buttonPressed, isLoading && s.buttonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={s.loginButtonText}>Entrar</Text>
            )}
          </Pressable>

          {/* Demo Mode */}
          <Pressable
            style={({ pressed }) => [s.demoButton, pressed && s.buttonPressed]}
            onPress={handleDemoMode}
          >
            <Text style={s.demoButtonText}>Experimentar sem conta</Text>
          </Pressable>

          {/* Register */}
          <View style={s.registerRow}>
            <Text style={s.registerText}>Não tem conta? </Text>
            <Pressable onPress={() => router.push('/(auth)/register')}>
              <Text style={s.registerLink}>Criar conta</Text>
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
    header: {
      alignItems: 'center',
      marginBottom: 40,
    },
    logoContainer: {
      width: 80,
      height: 80,
      borderRadius: 20,
      overflow: 'hidden',
      marginBottom: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 8,
    },
    logo: {
      width: 80,
      height: 80,
    },
    appName: {
      fontSize: 28,
      fontWeight: '700',
      color: colors.foreground,
      letterSpacing: -0.5,
    },
    tagline: {
      fontSize: 14,
      color: colors.muted,
      marginTop: 4,
    },
    form: {
      flex: 1,
    },
    formTitle: {
      fontSize: 22,
      fontWeight: '700',
      color: colors.foreground,
      marginBottom: 24,
    },
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
      flex: 1,
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
    forgotButton: {
      alignSelf: 'flex-end',
      marginBottom: 24,
      marginTop: -4,
    },
    forgotText: {
      fontSize: 13,
      color: colors.primary,
      fontWeight: '500',
    },
    loginButton: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      height: 52,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    loginButtonText: {
      fontSize: 16,
      fontWeight: '700',
      color: '#FFFFFF',
      letterSpacing: 0.3,
    },
    demoButton: {
      borderWidth: 1.5,
      borderColor: colors.border,
      borderRadius: 12,
      height: 52,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 24,
    },
    demoButtonText: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.muted,
    },
    buttonPressed: {
      opacity: 0.8,
      transform: [{ scale: 0.98 }],
    },
    buttonDisabled: {
      opacity: 0.6,
    },
    registerRow: {
      flexDirection: 'row',
      justifyContent: 'center',
    },
    registerText: {
      fontSize: 14,
      color: colors.muted,
    },
    registerLink: {
      fontSize: 14,
      color: colors.primary,
      fontWeight: '600',
    },
  });
