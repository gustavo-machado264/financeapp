import { supabase } from '@/lib/supabase';
import type { Transaction, NewTransaction, UpdateTransaction } from '@/types';

function generateId(): string {
  return `local_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function isLocalId(id: string): boolean {
  return id.startsWith('local_') || id.startsWith('demo-') || /^\d+$/.test(id);
}

export const transactionsService = {
  async getAll(userId: string): Promise<Transaction[]> {
    if (userId === 'demo-user') return [];

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) throw error;
    return (data ?? []) as Transaction[];
  },

  async create(userId: string, transaction: NewTransaction): Promise<Transaction> {
    if (userId === 'demo-user') {
      return {
        ...transaction,
        id: generateId(),
        user_id: userId,
        created_at: new Date().toISOString(),
      } as Transaction;
    }

    const { data, error } = await supabase
      .from('transactions')
      .insert({ ...transaction, user_id: userId })
      .select()
      .single();

    if (error) throw error;
    return data as Transaction;
  },

  async update(update: UpdateTransaction): Promise<Transaction> {
    const { id, ...rest } = update;

    if (isLocalId(id)) {
      return update as unknown as Transaction;
    }

    const { data, error } = await supabase
      .from('transactions')
      .update(rest)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Transaction;
  },

  async delete(id: string): Promise<void> {
    if (isLocalId(id)) return;

    const { error } = await supabase.from('transactions').delete().eq('id', id);
    if (error) throw error;
  },
};
