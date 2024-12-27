import { useEffect } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { useMetricsStore } from './use-metrics-store';
import { syncUserMetrics, syncFocusSessions } from '@/lib/api/sync';

export function useMetricsSync() {
  const { user } = useAuth();
  const { setDailyMetrics, setFocusSessions } = useMetricsStore();

  useEffect(() => {
    if (!user) return;

    const syncData = async () => {
      const [metrics, sessions] = await Promise.all([
        syncUserMetrics(user.id),
        syncFocusSessions(user.id)
      ]);

      if (metrics) {
        setDailyMetrics(metrics);
      }
      if (sessions) {
        setFocusSessions(sessions);
      }
    };

    syncData();
    
    // Sync every minute
    const interval = setInterval(syncData, 60000);

    return () => clearInterval(interval);
  }, [user, setDailyMetrics, setFocusSessions]);
}