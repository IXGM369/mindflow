import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { getDashboardMetrics, getWeeklyMetrics, getTaskDistribution } from '@/lib/api/dashboard';
import type { DailyMetrics, FocusSession } from '@/lib/types/focus';

export function useDashboard() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState<{
    today: DailyMetrics;
    weekSessions: FocusSession[];
    weeklyMetrics: DailyMetrics[];
    taskDistribution: { name: string; value: number; }[];
  }>({
    today: {} as DailyMetrics,
    weekSessions: [],
    weeklyMetrics: [],
    taskDistribution: [],
  });

  useEffect(() => {
    if (!user) return;

    const loadDashboardData = async () => {
      try {
        const [dashboardData, weeklyData, distribution] = await Promise.all([
          getDashboardMetrics(user.id),
          getWeeklyMetrics(user.id),
          getTaskDistribution(user.id),
        ]);

        setMetrics({
          today: dashboardData.today,
          weekSessions: dashboardData.weekSessions,
          weeklyMetrics: weeklyData,
          taskDistribution: distribution,
        });
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [user]);

  return { metrics, isLoading };
}