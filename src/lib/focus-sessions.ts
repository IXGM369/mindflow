import { supabase } from './supabase';
import type { FocusSession } from './types/focus';

export async function createFocusSession(
  userId: string,
  sessionData: Omit<FocusSession, 'id' | 'user_id' | 'created_at'>
) {
  const { data, error } = await supabase
    .from('focus_sessions')
    .insert({
      user_id: userId,
      ...sessionData,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateFocusSession(
  sessionId: string,
  userId: string,
  updates: Partial<FocusSession>
) {
  const { data, error } = await supabase
    .from('focus_sessions')
    .update(updates)
    .eq('id', sessionId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getFocusSessions(userId: string, limit = 10) {
  const { data, error } = await supabase
    .from('focus_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

export async function getDailyFocusStats(userId: string, date: string) {
  const { data, error } = await supabase
    .from('daily_metrics')
    .select('*')
    .eq('user_id', userId)
    .eq('date', date)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}