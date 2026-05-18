import { useEffect } from 'react';
import { useAuthStore, useTransactionsStore, useGoalsStore } from '@/store';
import { authService } from '@/services/auth';
import { DEMO_USER, DEMO_TRANSACTIONS, DEMO_GOALS } from '@/utils/mockData';

export function useAppAuth() {
  const { user, isLoading, setUser, setLoading, logout, clearUser } = useAuthStore();
  const { setTransactions } = useTransactionsStore();
  const { setGoals } = useGoalsStore();

  useEffect(() => {
    // Check initial session
    const initAuth = async () => {
      try {
        const session = await authService.getSession();
        if (session) {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen for auth state changes
    const { data: { subscription } } = authService.onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      await authService.signIn(email, password);
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      await authService.signUp(name, email, password);
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await authService.signOut();
      clearUser();
      setTransactions([]);
      setGoals([]);
    } finally {
      setLoading(false);
    }
  };

  const loginAsDemo = () => {
    setUser(DEMO_USER);
    setTransactions(DEMO_TRANSACTIONS);
    setGoals(DEMO_GOALS);
  };

  const resetPassword = async (email: string) => {
    await authService.resetPassword(email);
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
    resetPassword,
    loginAsDemo,
  };
}
