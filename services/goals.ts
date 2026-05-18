import { supabase } from '@/lib/supabase';
import type { Goal, NewGoal, UpdateGoal } from '@/types';

function generateId(): string {
  return `local_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function isLocalId(id: string): boolean {
  return id.startsWith('local_') || id.startsWith('demo-') || /^g\d+$/.test(id);
}

export const goalsService = {
  async getAll(userId: string): Promise<Goal[]> {
    if (userId === 'demo-user') return [];

    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data ?? []) as Goal[];
  },

  async create(userId: string, goal: NewGoal): Promise<Goal> {
    if (userId === 'demo-user') {
      return {
        ...goal,
        id: generateId(),
        user_id: userId,
        created_at: new Date().toISOString(),
      } as Goal;
    }

    const { data, error } = await supabase
      .from('goals')
      .insert({ ...goal, user_id: userId })
      .select()
      .single();

    if (error) throw error;
    return data as Goal;
  },

  async update(update: UpdateGoal): Promise<Goal> {
    const { id, ...rest } = update;

    if (isLocalId(id)) {
      return update as unknown as Goal;
    }

    const { data, error } = await supabase
      .from('goals')
      .update(rest)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Goal;
  },

  async delete(id: string): Promise<void> {
    if (isLocalId(id)) return;

    const { error } = await supabase.from('goals').delete().eq('id', id);
    if (error) throw error;
  },
};
