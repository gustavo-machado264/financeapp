import type { Transaction, Goal, User } from '@/types';

export const DEMO_USER: User = {
  id: 'demo-user',
  name: 'João Silva',
  email: 'joao@exemplo.com',
  created_at: new Date().toISOString(),
};

const now = new Date();
const makeDate = (daysAgo: number) => {
  const d = new Date(now);
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
};

export const DEMO_TRANSACTIONS: Transaction[] = [
  { id: '1', user_id: 'demo-user', type: 'income', title: 'Salário', amount: 5500, category: 'salary', date: makeDate(2), created_at: makeDate(2) },
  { id: '2', user_id: 'demo-user', type: 'expense', title: 'Aluguel', amount: 1500, category: 'housing', date: makeDate(3), created_at: makeDate(3) },
  { id: '3', user_id: 'demo-user', type: 'expense', title: 'Supermercado', amount: 320, category: 'food', date: makeDate(4), created_at: makeDate(4) },
  { id: '4', user_id: 'demo-user', type: 'expense', title: 'Uber', amount: 45, category: 'transport', date: makeDate(5), created_at: makeDate(5) },
  { id: '5', user_id: 'demo-user', type: 'income', title: 'Freelance Web', amount: 1200, category: 'freelance', date: makeDate(6), created_at: makeDate(6) },
  { id: '6', user_id: 'demo-user', type: 'expense', title: 'Academia', amount: 89, category: 'health', date: makeDate(7), created_at: makeDate(7) },
  { id: '7', user_id: 'demo-user', type: 'expense', title: 'Netflix', amount: 39.9, category: 'leisure', date: makeDate(8), created_at: makeDate(8) },
  { id: '8', user_id: 'demo-user', type: 'expense', title: 'Curso Online', amount: 197, category: 'education', date: makeDate(10), created_at: makeDate(10) },
  { id: '9', user_id: 'demo-user', type: 'income', title: 'Dividendos', amount: 350, category: 'investments', date: makeDate(12), created_at: makeDate(12) },
  { id: '10', user_id: 'demo-user', type: 'expense', title: 'Restaurante', amount: 85, category: 'food', date: makeDate(14), created_at: makeDate(14) },
  { id: '11', user_id: 'demo-user', type: 'expense', title: 'Farmácia', amount: 62, category: 'health', date: makeDate(15), created_at: makeDate(15) },
  { id: '12', user_id: 'demo-user', type: 'expense', title: 'Gasolina', amount: 150, category: 'transport', date: makeDate(16), created_at: makeDate(16) },
  // Previous month
  { id: '13', user_id: 'demo-user', type: 'income', title: 'Salário', amount: 5500, category: 'salary', date: makeDate(35), created_at: makeDate(35) },
  { id: '14', user_id: 'demo-user', type: 'expense', title: 'Aluguel', amount: 1500, category: 'housing', date: makeDate(36), created_at: makeDate(36) },
  { id: '15', user_id: 'demo-user', type: 'expense', title: 'Supermercado', amount: 280, category: 'food', date: makeDate(38), created_at: makeDate(38) },
  { id: '16', user_id: 'demo-user', type: 'expense', title: 'Lazer', amount: 200, category: 'leisure', date: makeDate(40), created_at: makeDate(40) },
];

export const DEMO_GOALS: Goal[] = [
  {
    id: 'g1',
    user_id: 'demo-user',
    title: 'Reserva de Emergência',
    target_amount: 15000,
    current_amount: 8500,
    deadline: new Date(now.getFullYear(), now.getMonth() + 6, 1).toISOString(),
    created_at: makeDate(60),
  },
  {
    id: 'g2',
    user_id: 'demo-user',
    title: 'Viagem para Europa',
    target_amount: 8000,
    current_amount: 2200,
    deadline: new Date(now.getFullYear() + 1, 6, 1).toISOString(),
    created_at: makeDate(30),
  },
  {
    id: 'g3',
    user_id: 'demo-user',
    title: 'Notebook Novo',
    target_amount: 4500,
    current_amount: 4050,
    deadline: new Date(now.getFullYear(), now.getMonth() + 1, 15).toISOString(),
    created_at: makeDate(45),
  },
];
