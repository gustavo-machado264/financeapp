import type { CategoryId, TransactionType } from '@/constants/finance';

// ─── User ────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

// ─── Transaction ─────────────────────────────────────────────────────────────

export interface Transaction {
  id: string;
  user_id: string;
  type: TransactionType;
  title: string;
  amount: number;
  category: CategoryId;
  description?: string;
  date: string; // ISO date string
  created_at: string;
}

export type NewTransaction = Omit<Transaction, 'id' | 'user_id' | 'created_at'>;
export type UpdateTransaction = Partial<NewTransaction> & { id: string };

// ─── Goal ────────────────────────────────────────────────────────────────────

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  target_amount: number;
  current_amount: number;
  deadline?: string; // ISO date string
  created_at: string;
}

export type NewGoal = Omit<Goal, 'id' | 'user_id' | 'created_at'>;
export type UpdateGoal = Partial<NewGoal> & { id: string };

// ─── Financial Summary ───────────────────────────────────────────────────────

export interface MonthlySummary {
  month: number; // 0-11
  year: number;
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export interface CategorySummary {
  category: CategoryId;
  total: number;
  percentage: number;
  count: number;
}

export interface FinancialInsight {
  id: string;
  type: 'warning' | 'info' | 'success';
  message: string;
  icon: string;
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// ─── Store ───────────────────────────────────────────────────────────────────

export interface AppSettings {
  isDarkMode: boolean;
  notificationsEnabled: boolean;
  hideBalance: boolean;
}
