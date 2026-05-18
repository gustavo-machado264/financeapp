import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider, useThemeContext } from '@/lib/theme-provider';
import { useSettingsStore } from '@/store';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { loadSettings } = useSettingsStore();

  useEffect(() => {
    const init = async () => {
      try { await loadSettings(); } catch {}
      await SplashScreen.hideAsync();
    };
    init();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <RootNavigator />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

function RootNavigator() {
  const { isDarkMode } = useSettingsStore();
  const { setColorScheme } = useThemeContext();

  useEffect(() => {
    setColorScheme(isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  return (
    <>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="transaction/add"
          options={{
            presentation: 'modal',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="transaction/[id]"
          options={{
            presentation: 'modal',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="goal/add"
          options={{
            presentation: 'modal',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="goal/[id]"
          options={{
            presentation: 'modal',
            headerShown: false,
          }}
        />
        <Stack.Screen name="settings" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
