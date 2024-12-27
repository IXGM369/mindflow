import { supabase } from '../supabase';
import type { DailyMetrics } from '../types/focus';

export async function getDailyMetrics(userId: string, date: string): Promise<DailyMetrics | null> {
  const { data, error } = await supabase
    .from('daily_metrics')
    .select('*')
    .eq('user_id', userId)
    .eq('date', date)
    .maybeSingle(); // Use maybeSingle instead of single to handle missing data

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function updateDailyMetrics(
  userId: string,
  metrics: Partial<DailyMetrics>
) {
  const date = new Date().toISOString().split('T')[0];
  const existing = await getDailyMetrics(userId, date);

  const { data, error } = await supabase
    .from('daily_metrics')
    .upsert({
      user_id: userId,
      date,
      focus_time: 0,
      deep_work_sessions: 0,
      energy_level: 0,
      productivity_score: 0,
      ...existing,
      ...metrics,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}