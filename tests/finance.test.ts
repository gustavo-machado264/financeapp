import { describe, it, expect } from 'vitest';

// ─── formatCurrency ───────────────────────────────────────────────────────────

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

describe('formatCurrency', () => {
  it('formats positive values as BRL', () => {
    const result = formatCurrency(1500);
    expect(result).toContain('1.500');
    expect(result).toContain('R$');
  });

  it('formats zero correctly', () => {
    const result = formatCurrency(0);
    expect(result).toContain('0');
  });

  it('formats decimal values', () => {
    const result = formatCurrency(39.9);
    expect(result).toContain('39');
  });
});

// ─── formatDate ───────────────────────────────────────────────────────────────

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

describe('formatDate', () => {
  it('formats date string to pt-BR format', () => {
    const result = formatDate('2026-01-15');
    expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}/);
  });

  it('formats ISO date correctly', () => {
    const result = formatDate('2026-05-18T00:00:00.000Z');
    expect(result).toContain('2026');
  });
});

// ─── Transaction summary logic ────────────────────────────────────────────────

type Transaction = {
  id: string;
  user_id: string;
  type: 'income' | 'expense';
  title: string;
  amount: number;
  category: string;
  date: string;
  created_at: string;
  description?: string;
};

function computeSummary(transactions: Transaction[]) {
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpense;
  return { totalIncome, totalExpense, balance };
}

const mockTransactions: Transaction[] = [
  { id: '1', user_id: 'u1', type: 'income', title: 'Salário', amount: 5000, category: 'salary', date: '2026-05-01', created_at: '2026-05-01' },
  { id: '2', user_id: 'u1', type: 'expense', title: 'Aluguel', amount: 1500, category: 'housing', date: '2026-05-02', created_at: '2026-05-02' },
  { id: '3', user_id: 'u1', type: 'expense', title: 'Supermercado', amount: 300, category: 'food', date: '2026-05-03', created_at: '2026-05-03' },
];

describe('computeSummary', () => {
  it('calculates total income correctly', () => {
    const { totalIncome } = computeSummary(mockTransactions);
    expect(totalIncome).toBe(5000);
  });

  it('calculates total expense correctly', () => {
    const { totalExpense } = computeSummary(mockTransactions);
    expect(totalExpense).toBe(1800);
  });

  it('calculates balance correctly', () => {
    const { balance } = computeSummary(mockTransactions);
    expect(balance).toBe(3200);
  });

  it('returns zeros for empty array', () => {
    const { totalIncome, totalExpense, balance } = computeSummary([]);
    expect(totalIncome).toBe(0);
    expect(totalExpense).toBe(0);
    expect(balance).toBe(0);
  });
});

// ─── Category filtering ───────────────────────────────────────────────────────

type Category = {
  id: string;
  label: string;
  icon: string;
  color: string;
  type: 'income' | 'expense' | 'both';
};

const CATEGORIES: Category[] = [
  { id: 'food', label: 'Alimentação', icon: 'restaurant', color: '#F97316', type: 'expense' },
  { id: 'salary', label: 'Salário', icon: 'account-balance-wallet', color: '#16A34A', type: 'income' },
  { id: 'other', label: 'Outros', icon: 'more-horiz', color: '#64748B', type: 'both' },
];

describe('Category filtering', () => {
  it('filters income categories correctly', () => {
    const income = CATEGORIES.filter((c) => c.type === 'income' || c.type === 'both');
    expect(income.map((c) => c.id)).toContain('salary');
    expect(income.map((c) => c.id)).toContain('other');
    expect(income.map((c) => c.id)).not.toContain('food');
  });

  it('filters expense categories correctly', () => {
    const expense = CATEGORIES.filter((c) => c.type === 'expense' || c.type === 'both');
    expect(expense.map((c) => c.id)).toContain('food');
    expect(expense.map((c) => c.id)).toContain('other');
    expect(expense.map((c) => c.id)).not.toContain('salary');
  });
});

// ─── Goal progress ────────────────────────────────────────────────────────────

type Goal = {
  id: string;
  user_id: string;
  title: string;
  target_amount: number;
  current_amount: number;
  deadline?: string;
  created_at: string;
};

function computeGoalProgress(goal: Goal): number {
  return Math.min((goal.current_amount / goal.target_amount) * 100, 100);
}

describe('computeGoalProgress', () => {
  it('returns 0 for empty goal', () => {
    const goal: Goal = { id: 'g1', user_id: 'u1', title: 'Test', target_amount: 1000, current_amount: 0, created_at: '2026-01-01' };
    expect(computeGoalProgress(goal)).toBe(0);
  });

  it('returns 50 for half-complete goal', () => {
    const goal: Goal = { id: 'g1', user_id: 'u1', title: 'Test', target_amount: 1000, current_amount: 500, created_at: '2026-01-01' };
    expect(computeGoalProgress(goal)).toBe(50);
  });

  it('caps at 100 for over-funded goal', () => {
    const goal: Goal = { id: 'g1', user_id: 'u1', title: 'Test', target_amount: 1000, current_amount: 1500, created_at: '2026-01-01' };
    expect(computeGoalProgress(goal)).toBe(100);
  });

  it('returns 100 for exactly completed goal', () => {
    const goal: Goal = { id: 'g1', user_id: 'u1', title: 'Test', target_amount: 1000, current_amount: 1000, created_at: '2026-01-01' };
    expect(computeGoalProgress(goal)).toBe(100);
  });
});

// ─── Demo data validation ─────────────────────────────────────────────────────

describe('Demo data', () => {
  const DEMO_USER = {
    id: 'demo-user',
    name: 'João Silva',
    email: 'joao@exemplo.com',
    created_at: new Date().toISOString(),
  };

  it('demo user has correct id', () => {
    expect(DEMO_USER.id).toBe('demo-user');
  });

  it('demo user has name and email', () => {
    expect(DEMO_USER.name).toBeTruthy();
    expect(DEMO_USER.email).toContain('@');
  });
});
