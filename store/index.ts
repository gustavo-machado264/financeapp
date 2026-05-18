import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Transaction, Goal, User, AppSettings } from '@/types';

// ─── Auth Store ───────────────────────────────────────────────────────────────

interface AuthStore {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setAuthenticated: (v: boolean) => void;
  clearUser: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),
  logout: () => set({ user: null }),
  isAuthenticated: false,
  setAuthenticated: (v: boolean) => set({ isAuthenticated: v }),
  clearUser: () => set({ user: null, isAuthenticated: false }),
}));

// ─── Transactions Store ───────────────────────────────────────────────────────

interface TransactionsStore {
  transactions: Transaction[];
  isLoading: boolean;
  setTransactions: (transactions: Transaction[]) => void;
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (id: string, data: Partial<Transaction>) => void;
  replaceTransaction: (transaction: Transaction) => void;
  removeTransaction: (id: string) => void;
  setLoading: (loading: boolean) => void;
}

export const useTransactionsStore = create<TransactionsStore>((set) => ({
  transactions: [],
  isLoading: false,
  setTransactions: (transactions) => set({ transactions }),
  addTransaction: (transaction) =>
    set((state) => ({ transactions: [transaction, ...state.transactions] })),
  updateTransaction: (id, data) =>
    set((state) => ({
      transactions: state.transactions.map((t) => (t.id === id ? { ...t, ...data } : t)),
    })),
  replaceTransaction: (transaction) =>
    set((state) => ({
      transactions: state.transactions.map((t) => (t.id === transaction.id ? transaction : t)),
    })),
  removeTransaction: (id) =>
    set((state) => ({ transactions: state.transactions.filter((t) => t.id !== id) })),
  setLoading: (isLoading) => set({ isLoading }),
}));

// ─── Goals Store ──────────────────────────────────────────────────────────────

interface GoalsStore {
  goals: Goal[];
  isLoading: boolean;
  setGoals: (goals: Goal[]) => void;
  addGoal: (goal: Goal) => void;
  updateGoal: (id: string, data: Partial<Goal>) => void;
  replaceGoal: (goal: Goal) => void;
  removeGoal: (id: string) => void;
  setLoading: (loading: boolean) => void;
}

export const useGoalsStore = create<GoalsStore>((set) => ({
  goals: [],
  isLoading: false,
  setGoals: (goals) => set({ goals }),
  addGoal: (goal) => set((state) => ({ goals: [goal, ...state.goals] })),
  updateGoal: (id, data) =>
    set((state) => ({
      goals: state.goals.map((g) => (g.id === id ? { ...g, ...data } : g)),
    })),
  replaceGoal: (goal) =>
    set((state) => ({ goals: state.goals.map((g) => (g.id === goal.id ? goal : g)) })),
  removeGoal: (id) => set((state) => ({ goals: state.goals.filter((g) => g.id !== id) })),
  setLoading: (isLoading) => set({ isLoading }),
}));

// ─── Settings Store ───────────────────────────────────────────────────────────

interface SettingsStore extends AppSettings {
  setDarkMode: (isDarkMode: boolean) => void;
  setNotifications: (enabled: boolean) => void;
  setHideBalance: (hide: boolean) => void;
  loadSettings: () => Promise<void>;
  saveSettings: () => Promise<void>;
}

const SETTINGS_KEY = '@financeapp_settings';

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  isDarkMode: false,
  notificationsEnabled: true,
  hideBalance: false,
  setDarkMode: (isDarkMode) => {
    set({ isDarkMode });
    get().saveSettings();
  },
  setNotifications: (notificationsEnabled) => {
    set({ notificationsEnabled });
    get().saveSettings();
  },
  setHideBalance: (hideBalance) => {
    set({ hideBalance });
    get().saveSettings();
  },
  loadSettings: async () => {
    try {
      const stored = await AsyncStorage.getItem(SETTINGS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<AppSettings>;
        set(parsed);
      }
    } catch {
      // ignore
    }
  },
  saveSettings: async () => {
    try {
      const { isDarkMode, notificationsEnabled, hideBalance } = get();
      await AsyncStorage.setItem(
        SETTINGS_KEY,
        JSON.stringify({ isDarkMode, notificationsEnabled, hideBalance })
      );
    } catch {
      // ignore
    }
  },
}));
