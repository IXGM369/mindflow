import { supabase } from '../supabase';
import type { FocusSession } from '../types/focus';

export async function getDailyFocusStats(userId: string, date: string) {
  const { data, error } = await supabase
    .from('daily_metrics')
    .select('*')
    .eq('user_id', userId)
    .eq('date', date)
    .maybeSingle(); // Use maybeSingle instead of single

  if (error && error.code !== 'PGRST116') throw error;
  
  // Return default values if no data exists
  return data || {
    focus_time: 0,
    deep_work_sessions: 0,
    energy_level: 0,
    productivity_score: 0,
    date,
    user_id: userId,
  };
}