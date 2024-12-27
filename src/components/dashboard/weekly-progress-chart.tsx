import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { DailyMetrics } from '@/lib/types/focus';

interface WeeklyProgressChartProps {
  data: DailyMetrics[];
}

export default function WeeklyProgressChart({ data }: WeeklyProgressChartProps) {
  const chartData = data.map(day => ({
    day: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
    deepWork: day.deep_work_sessions,
    focusHours: Math.round(day.focus_time / 60 * 10) / 10,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis yAxisId="left" />
        <YAxis yAxisId="right" orientation="right" />
        <Tooltip />
        <Bar 
          yAxisId="left"
          dataKey="deepWork" 
          fill="hsl(var(--chart-1))" 
          name="Deep Work Sessions" 
        />
        <Bar 
          yAxisId="right"
          dataKey="focusHours" 
          fill="hsl(var(--chart-2))" 
          name="Focus Hours" 
        />
      </BarChart>
    </ResponsiveContainer>
  );
}