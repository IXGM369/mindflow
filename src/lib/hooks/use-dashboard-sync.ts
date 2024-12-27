import { useEffect } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { useMetricsStore } from './use-metrics-store';
import { getDashboardMetrics } from '@/lib/api/dashboard';
import { toast } from 'sonner';

export function useDashboardSync() {
  const { user } = useAuth();
  const { setDailyMetrics, setFocusSessions, reset } = useMetricsStore();

  useEffect(() => {
    if (!user) {
      reset();
      return;
    }

    const syncDashboard = async () => {
      try {
        const { today, weekSessions } = await getDashboardMetrics(user.id);
        setDailyMetrics(today);
        setFocusSessions(weekSessions);
      } catch (error) {
        console.error('Failed to sync dashboard:', error);
        toast.error('Failed to load dashboard data');
      }
    };

    syncDashboard();

    // Sync every 5 minutes
    const interval = setInterval(syncDashboard, 5 * 60 * 1000);

    return () => {
      clearInterval(interval);
      reset();
    };
  }, [user, setDailyMetrics, setFocusSessions, reset]);
}