export type TransactionType = 'income' | 'expense';

export type CategoryId =
  | 'food'
  | 'transport'
  | 'housing'
  | 'education'
  | 'health'
  | 'leisure'
  | 'salary'
  | 'freelance'
  | 'investments'
  | 'other';

export interface Category {
  id: CategoryId;
  label: string;
  icon: string;
  color: string;
  type: 'income' | 'expense' | 'both';
}

export const CATEGORIES: Category[] = [
  { id: 'food', label: 'Alimentação', icon: 'restaurant', color: '#F97316', type: 'expense' },
  { id: 'transport', label: 'Transporte', icon: 'directions-car', color: '#6366F1', type: 'expense' },
  { id: 'housing', label: 'Moradia', icon: 'home', color: '#0EA5E9', type: 'expense' },
  { id: 'education', label: 'Estudos', icon: 'school', color: '#8B5CF6', type: 'expense' },
  { id: 'health', label: 'Saúde', icon: 'favorite', color: '#EC4899', type: 'expense' },
  { id: 'leisure', label: 'Lazer', icon: 'sports-esports', color: '#14B8A6', type: 'expense' },
  { id: 'salary', label: 'Salário', icon: 'account-balance-wallet', color: '#16A34A', type: 'income' },
  { id: 'freelance', label: 'Freelance', icon: 'laptop', color: '#0D9488', type: 'income' },
  { id: 'investments', label: 'Investimentos', icon: 'trending-up', color: '#1E3A8A', type: 'income' },
  { id: 'other', label: 'Outros', icon: 'more-horiz', color: '#64748B', type: 'both' },
];

export const getCategoryById = (id: CategoryId): Category =>
  CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[CATEGORIES.length - 1];

export const INCOME_CATEGORIES = CATEGORIES.filter((c) => c.type === 'income' || c.type === 'both');
export const EXPENSE_CATEGORIES = CATEGORIES.filter((c) => c.type === 'expense' || c.type === 'both');

export const MONTHS_PT = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

export const SHORT_MONTHS_PT = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez',
];
