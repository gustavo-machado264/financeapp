import { useCallback } from 'react';
import { useGoalsStore, useAuthStore } from '@/store';
import { goalsService } from '@/services/goals';
import type { NewGoal, UpdateGoal } from '@/types';

export function useGoals() {
  const { goals, isLoading, setGoals, addGoal, updateGoal, removeGoal, setLoading } = useGoalsStore();
  const { user } = useAuthStore();

  const loadGoals = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await goalsService.getAll(user.id);
      setGoals(data);
    } catch (err) {
      console.error('Failed to load goals:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const createGoal = useCallback(
    async (goal: NewGoal) => {
      if (!user) return;
      const newGoal = await goalsService.create(user.id, goal);
      addGoal(newGoal);
      return newGoal;
    },
    [user]
  );

  const editGoal = useCallback(async (update: UpdateGoal) => {
    const updated = await goalsService.update(update);
    updateGoal(update.id, updated);
    return updated;
  }, []);

  const deleteGoal = useCallback(async (id: string) => {
    await goalsService.delete(id);
    removeGoal(id);
  }, []);

  return {
    goals,
    isLoading,
    loadGoals,
    createGoal,
    editGoal,
    deleteGoal,
  };
}
