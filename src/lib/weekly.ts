import { supabase } from './supabase';
import type { WeeklyReflection } from './types/user';

export async function createWeeklyReflection(
  userId: string,
  reflection: Omit<WeeklyReflection, 'id' | 'user_id' | 'created_at'>
) {
  const { data, error } = await supabase
    .from('weekly_reflections')
    .insert({
      user_id: userId,
      ...reflection,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getWeeklyReflections(userId: string, limit = 4) {
  const { data, error } = await supabase
    .from('weekly_reflections')
    .select('*')
    .eq('user_id', userId)
    .order('week_start', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

export async function updateWeeklyReflection(
  reflectionId: string,
  userId: string,
  updates: Partial<WeeklyReflection>
) {
  const { data, error } = await supabase
    .from('weekly_reflections')
    .update(updates)
    .eq('id', reflectionId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}