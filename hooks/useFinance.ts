import { useMemo } from 'react';
import { useTransactionsStore } from '@/store';
import type { Transaction, MonthlySummary, CategorySummary, FinancialInsight } from '@/types';
import type { CategoryId } from '@/constants/finance';
import { SHORT_MONTHS_PT } from '@/constants/finance';

// ─── useTransactionSummary ────────────────────────────────────────────────────

export function useTransactionSummary(transactions: Transaction[]) {
  return useMemo(() => {
    const totalIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpense;

    return { totalIncome, totalExpense, balance };
  }, [transactions]);
}

// ─── useCurrentMonthTransactions ─────────────────────────────────────────────

export function useCurrentMonthTransactions() {
  const { transactions } = useTransactionsStore();
  return useMemo(() => {
    const now = new Date();
    return transactions.filter((t) => {
      const d = new Date(t.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
  }, [transactions]);
}

// ─── useMonthlySummaries ──────────────────────────────────────────────────────

export function useMonthlySummaries(transactions: Transaction[], months = 6): MonthlySummary[] {
  return useMemo(() => {
    const now = new Date();
    const result: MonthlySummary[] = [];

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = date.getMonth();
      const year = date.getFullYear();

      const monthTransactions = transactions.filter((t) => {
        const d = new Date(t.date);
        return d.getMonth() === month && d.getFullYear() === year;
      });

      const totalIncome = monthTransactions
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const totalExpense = monthTransactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      result.push({ month, year, totalIncome, totalExpense, balance: totalIncome - totalExpense });
    }

    return result;
  }, [transactions, months]);
}

// ─── useCategorySummaries ─────────────────────────────────────────────────────

export function useCategorySummaries(
  transactions: Transaction[],
  type: 'income' | 'expense' = 'expense'
): CategorySummary[] {
  return useMemo(() => {
    const filtered = transactions.filter((t) => t.type === type);
    const total = filtered.reduce((sum, t) => sum + t.amount, 0);

    const grouped: Record<string, number> = {};
    const counts: Record<string, number> = {};

    filtered.forEach((t) => {
      grouped[t.category] = (grouped[t.category] ?? 0) + t.amount;
      counts[t.category] = (counts[t.category] ?? 0) + 1;
    });

    return Object.entries(grouped)
      .map(([category, catTotal]) => ({
        category: category as CategoryId,
        total: catTotal,
        percentage: total > 0 ? (catTotal / total) * 100 : 0,
        count: counts[category] ?? 0,
      }))
      .sort((a, b) => b.total - a.total);
  }, [transactions, type]);
}

// ─── useFinancialInsights ─────────────────────────────────────────────────────

export function useFinancialInsights(transactions: Transaction[]): FinancialInsight[] {
  return useMemo(() => {
    const insights: FinancialInsight[] = [];
    const now = new Date();

    const currentMonth = transactions.filter((t) => {
      const d = new Date(t.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });

    const prevMonth = transactions.filter((t) => {
      const d = new Date(t.date);
      const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      return d.getMonth() === prev.getMonth() && d.getFullYear() === prev.getFullYear();
    });

    const currExpense = currentMonth.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const prevExpense = prevMonth.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const currIncome = currentMonth.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);

    if (prevExpense > 0 && currExpense > prevExpense) {
      const pct = Math.round(((currExpense - prevExpense) / prevExpense) * 100);
      insights.push({
        id: 'expense_increase',
        type: 'warning',
        message: `Você gastou ${pct}% a mais este mês comparado ao anterior.`,
        icon: 'trending-up',
      });
    }

    if (prevExpense > 0 && currExpense < prevExpense) {
      const pct = Math.round(((prevExpense - currExpense) / prevExpense) * 100);
      insights.push({
        id: 'expense_decrease',
        type: 'success',
        message: `Ótimo! Você reduziu seus gastos em ${pct}% este mês.`,
        icon: 'trending-down',
      });
    }

    if (currIncome > 0 && currExpense > currIncome) {
      insights.push({
        id: 'negative_balance',
        type: 'warning',
        message: 'Suas despesas estão maiores que suas receitas este mês.',
        icon: 'warning',
      });
    }

    if (currIncome > 0 && currExpense <= currIncome * 0.5) {
      insights.push({
        id: 'good_savings',
        type: 'success',
        message: 'Excelente! Você está economizando mais de 50% da sua renda.',
        icon: 'savings',
      });
    }

    if (insights.length === 0) {
      insights.push({
        id: 'default',
        type: 'info',
        message: 'Continue registrando suas transações para receber insights personalizados.',
        icon: 'lightbulb',
      });
    }

    return insights;
  }, [transactions]);
}

// ─── formatCurrency ───────────────────────────────────────────────────────────

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

// ─── formatDate ───────────────────────────────────────────────────────────────

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function formatMonthYear(month: number, year: number): string {
  return `${SHORT_MONTHS_PT[month]} ${year}`;
}
