import { Card } from '@/components/ui/card';
import { Clock, Brain, Battery, Zap } from 'lucide-react';
import { useDashboard } from '@/hooks/use-dashboard';
import { useMetricsSync } from '@/hooks/use-metrics-sync';
import { MetricCard } from './metric-card';
import DailyFocusChart from './daily-focus-chart';
import WeeklyProgressChart from './weekly-progress-chart';
import TaskDistributionChart from './task-distribution-chart';

export default function Dashboard() {
  const { metrics, isLoading } = useDashboard();
  useMetricsSync();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="h-[200px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </div>
    );
  }

  const { today } = metrics;
  const focusTimeHours = Math.floor((today?.focus_time || 0) / 60);
  const focusTimeMinutes = (today?.focus_time || 0) % 60;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={<Clock className="w-5 h-5" />}
          title="Focus Time"
          value={`${focusTimeHours}h ${focusTimeMinutes}m`}
          target="6h"
          progress={((today?.focus_time || 0) / 360) * 100}
        />
        <MetricCard
          icon={<Brain className="w-5 h-5" />}
          title="Deep Work"
          value={`${today?.deep_work_sessions || 0} sessions`}
          target="4 sessions"
          progress={((today?.deep_work_sessions || 0) / 4) * 100}
        />
        <MetricCard
          icon={<Battery className="w-5 h-5" />}
          title="Energy Level"
          value={`${today?.energy_level || 0}/5`}
          target="5/5"
          progress={((today?.energy_level || 0) / 5) * 100}
        />
        <MetricCard
          icon={<Zap className="w-5 h-5" />}
          title="Productivity"
          value={`${today?.productivity_score || 0}/5`}
          target="5/5"
          progress={((today?.productivity_score || 0) / 5) * 100}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Daily Focus Trend</h2>
          <DailyFocusChart data={metrics.weekSessions} />
        </Card>
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Weekly Progress</h2>
          <WeeklyProgressChart data={metrics.weeklyMetrics} />
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Task Distribution</h2>
        <TaskDistributionChart data={metrics.taskDistribution} />
      </Card>
    </div>
  );
}