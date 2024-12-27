import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { Card } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { getDailyFocusStats } from '@/lib/focus-sessions';
import type { DailyMetrics } from '@/lib/types/focus';

export default function WeeklyStats() {
  const { user } = useAuth();
  const [weekData, setWeekData] = useState<DailyMetrics[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const loadWeekData = async () => {
      try {
        const today = new Date();
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay() + 1);

        const weekDays = Array.from({ length: 5 }, (_, i) => {
          const date = new Date(weekStart);
          date.setDate(weekStart.getDate() + i);
          return date.toISOString().split('T')[0];
        });

        const metricsPromises = weekDays.map(date => 
          getDailyFocusStats(user.id, date).catch(() => null)
        );

        const results = await Promise.all(metricsPromises);
        setWeekData(results.filter(Boolean) as DailyMetrics[]);
        setError(null);
      } catch (error) {
        console.error('Failed to load week data:', error);
        setError('Failed to load weekly statistics');
      } finally {
        setIsLoading(false);
      }
    };

    loadWeekData();
  }, [user]);

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <div className="h-[300px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <div className="h-[300px] flex items-center justify-center text-destructive">
            {error}
          </div>
        </Card>
      </div>
    );
  }

  const chartData = weekData.map(day => ({
    date: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
    focusTime: Math.round(day.focus_time / 60),
    deepWork: day.deep_work_sessions,
  }));

  const mostProductiveDay = weekData.reduce((max, curr) => 
    curr.focus_time > (max?.focus_time || 0) ? curr : max
  , weekData[0]);

  const averageFocusTime = weekData.length > 0
    ? weekData.reduce((sum, curr) => sum + curr.focus_time, 0) / weekData.length / 60
    : 0;

  const averageScore = weekData.length > 0
    ? weekData.reduce((sum, curr) => sum + curr.productivity_score, 0) / weekData.length
    : 0;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Focus Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date"
              tick={{ fontSize: 12 }}
              tickMargin={8}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickMargin={8}
            />
            <Tooltip />
            <Bar
              dataKey="focusTime"
              name="Focus Time (hours)"
              fill="hsl(var(--primary))"
            />
            <Bar
              dataKey="deepWork"
              name="Deep Work Sessions"
              fill="hsl(var(--secondary))"
            />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Weekly Highlights</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">Most Productive Day</p>
            <p className="text-2xl font-bold">
              {mostProductiveDay ? new Date(mostProductiveDay.date).toLocaleDateString('en-US', { weekday: 'long' }) : '-'}
            </p>
            <p className="text-sm text-muted-foreground">
              {mostProductiveDay ? `${Math.round(mostProductiveDay.focus_time / 60)} hours of focus time` : 'No data available'}
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Average Daily Focus</p>
            <p className="text-2xl font-bold">{averageFocusTime.toFixed(1)} hours</p>
            <p className="text-sm text-muted-foreground">Across all working days</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Productivity Score</p>
            <p className="text-2xl font-bold">{averageScore.toFixed(1)}/5</p>
            <p className="text-sm text-muted-foreground">Weekly average</p>
          </div>
        </div>
      </Card>
    </div>
  );
}