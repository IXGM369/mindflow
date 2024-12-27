import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { FocusSession } from '@/lib/types/focus';

interface DailyFocusChartProps {
  data: FocusSession[];
}

export default function DailyFocusChart({ data }: DailyFocusChartProps) {
  const chartData = data.reduce((acc: any[], session) => {
    const hour = new Date(session.start_time).getHours();
    const existing = acc.find(item => item.time === hour);
    
    if (existing) {
      existing.focus = Math.max(existing.focus, session.focus_score || 0);
    } else {
      acc.push({
        time: hour,
        focus: session.focus_score || 0,
      });
    }
    
    return acc;
  }, []).sort((a, b) => a.time - b.time);

  // Add default props to XAxis and YAxis to fix warnings
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="time"
          tickFormatter={(hour) => `${hour}:00`}
          tick={{ fontSize: 12 }}
          tickMargin={8}
          scale="point"
          padding={{ left: 10, right: 10 }}
        />
        <YAxis 
          domain={[0, 5]}
          tick={{ fontSize: 12 }}
          tickMargin={8}
          allowDecimals={false}
        />
        <Tooltip 
          formatter={(value) => [`${value}/5`, 'Focus Score']}
          labelFormatter={(hour) => `${hour}:00`}
        />
        <Line
          type="monotone"
          dataKey="focus"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}