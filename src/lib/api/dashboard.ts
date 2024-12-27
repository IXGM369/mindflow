import { supabase } from '../supabase';
import type { DailyMetrics, FocusSession } from '../types/focus';

export async function getDashboardMetrics(userId: string) {
  const today = new Date().toISOString().split('T')[0];
  
  // Get today's metrics
  const { data: todayMetrics } = await supabase
    .from('daily_metrics')
    .select('*')
    .eq('user_id', userId)
    .eq('date', today)
    .single();

  // Get this week's focus sessions
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);
  const weekStartStr = weekStart.toISOString().split('T')[0];

  const { data: weekSessions } = await supabase
    .from('focus_sessions')
    .select('*')
    .eq('user_id', userId)
    .gte('start_time', weekStartStr)
    .order('start_time', { ascending: true });

  return {
    today: todayMetrics || createEmptyMetrics(userId, today),
    weekSessions: weekSessions || [],
  };
}

function createEmptyMetrics(userId: string, date: string): DailyMetrics {
  return {
    id: '',
    user_id: userId,
    date,
    focus_time: 0,
    deep_work_sessions: 0,
    energy_level: 0,
    productivity_score: 0,
    created_at: new Date().toISOString(),
  };
}

export async function getWeeklyMetrics(userId: string) {
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);
  
  const dates = Array.from({ length: 5 }, (_, i) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + i);
    return date.toISOString().split('T')[0];
  });

  const { data: metrics } = await supabase
    .from('daily_metrics')
    .select('*')
    .eq('user_id', userId)
    .in('date', dates)
    .order('date', { ascending: true });

  return metrics || [];
}

export async function getTaskDistribution(userId: string) {
  const { data: sessions } = await supabase
    .from('focus_sessions')
    .select('duration, session_type')
    .eq('user_id', userId)
    .gte('start_time', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

  const totalTime = sessions?.reduce((sum, session) => sum + (session.duration || 0), 0) || 0;
  const deepWorkTime = sessions?.filter(s => s.session_type === 'deep_work')
    .reduce((sum, session) => sum + (session.duration || 0), 0) || 0;
  
  return [
    { name: 'Deep Work', value: Math.round((deepWorkTime / totalTime) * 100) || 0 },
    { name: 'Shallow Work', value: Math.round(((totalTime - deepWorkTime) / totalTime) * 100) || 0 },
  ];
}