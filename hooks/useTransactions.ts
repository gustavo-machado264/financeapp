import { useCallback } from 'react';
import { useTransactionsStore, useAuthStore } from '@/store';
import { transactionsService } from '@/services/transactions';
import type { NewTransaction, UpdateTransaction } from '@/types';

export function useTransactions() {
  const { transactions, isLoading, setTransactions, addTransaction, updateTransaction, removeTransaction, setLoading } =
    useTransactionsStore();
  const { user } = useAuthStore();

  const loadTransactions = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await transactionsService.getAll(user.id);
      setTransactions(data);
    } catch (err) {
      console.error('Failed to load transactions:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const createTransaction = useCallback(
    async (transaction: NewTransaction) => {
      if (!user) return;
      const newTx = await transactionsService.create(user.id, transaction);
      addTransaction(newTx);
      return newTx;
    },
    [user]
  );

  const editTransaction = useCallback(async (update: UpdateTransaction) => {
    const updated = await transactionsService.update(update);
    updateTransaction(update.id, updated);
    return updated;
  }, []);

  const deleteTransaction = useCallback(async (id: string) => {
    await transactionsService.delete(id);
    removeTransaction(id);
  }, []);

  return {
    transactions,
    isLoading,
    loadTransactions,
    createTransaction,
    editTransaction,
    deleteTransaction,
  };
}
