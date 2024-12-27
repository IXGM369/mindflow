import { supabase } from './supabase';
import type { FocusSession } from './types/user';

export async function createFocusSession(
  userId: string,
  sessionType: 'deep_work' | 'pomodoro',
  duration: number
) {
  const { data, error } = await supabase
    .from('focus_sessions')
    .insert({
      user_id: userId,
      session_type: sessionType,
      duration,
      start_time: new Date().toISOString(),
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