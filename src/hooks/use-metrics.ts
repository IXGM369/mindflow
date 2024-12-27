import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { getDailyFocusStats } from '@/lib/focus-sessions';
import { updateDailyMetrics } from '@/lib/api/metrics';
import type { DailyMetrics } from '@/lib/types/focus';

export function useMetrics() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<DailyMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const loadMetrics = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const data = await getDailyFocusStats(user.id, today);
        setMetrics(data || null);
      } catch (error) {
        console.error('Failed to load metrics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMetrics();
  }, [user]);

  const updateMetrics = async (updates: Partial<DailyMetrics>) => {
    if (!user) return;

    try {
      const updated = await updateDailyMetrics(user.id, updates);
      setMetrics(updated);
      return updated;
    } catch (error) {
      console.error('Failed to update metrics:', error);
      throw error;
    }
  };

  return {
    metrics,
    isLoading,
    updateMetrics,
  };
}