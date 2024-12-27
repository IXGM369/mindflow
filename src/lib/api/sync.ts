import { supabase } from '../supabase';
import { toast } from 'sonner';
import type { DailyMetrics, FocusSession } from '../types/focus';

export async function syncUserMetrics(userId: string) {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // Get today's metrics
    const { data: metrics, error: metricsError } = await supabase
      .from('daily_metrics')
      .select('*')
      .eq('user_id', userId)
      .eq('date', today)
      .maybeSingle();

    if (metricsError) {
      console.error('Error fetching metrics:', metricsError);
      return null;
    }

    // If no metrics exist for today, create them
    if (!metrics) {
      const { data: newMetrics, error: createError } = await supabase
        .from('daily_metrics')
        .insert({
          user_id: userId,
          date: today,
          focus_time: 0,
          deep_work_sessions: 0,
          energy_level: 1, // Changed from 0 to meet check constraint
          productivity_score: 1 // Changed from 0 to meet check constraint
        })
        .select()
        .single();

      if (createError) {
        console.error('Error creating metrics:', createError);
        return null;
      }

      return newMetrics;
    }

    return metrics;
  } catch (error) {
    console.error('Sync error:', error);
    toast.error('Failed to sync metrics');
    return null;
  }
}

export async function syncFocusSessions(userId: string) {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const { data: sessions, error } = await supabase
      .from('focus_sessions')
      .select('*')
      .eq('user_id', userId)
      .gte('start_time', today)
      .order('start_time', { ascending: false });

    if (error) {
      console.error('Error fetching sessions:', error);
      return [];
    }

    return sessions || [];
  } catch (error) {
    console.error('Sync error:', error);
    toast.error('Failed to sync focus sessions');
    return [];
  }
}