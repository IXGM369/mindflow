import { supabase } from '../supabase';
import type { WeeklyReflection } from '../types/focus';

export async function saveWeeklyReflection(
  userId: string,
  reflection: Partial<WeeklyReflection>
) {
  const weekStart = getWeekStart();
  
  const { data, error } = await supabase
    .from('weekly_reflections')
    .upsert({
      user_id: userId,
      week_start: weekStart,
      ...reflection,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getWeeklyReflection(userId: string) {
  const weekStart = getWeekStart();
  
  const { data, error } = await supabase
    .from('weekly_reflections')
    .select('*')
    .eq('user_id', userId)
    .eq('week_start', weekStart)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

function getWeekStart() {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
  const weekStart = new Date(now.setDate(diff));
  return weekStart.toISOString().split('T')[0];
}