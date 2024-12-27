import { useState } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { useMetrics } from '@/hooks/use-metrics';
import { cn } from '@/lib/utils';

export default function Calendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { metrics } = useMetrics();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Focus Calendar</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <CalendarIcon className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Focus Schedule</h2>
          </div>
          
          <CalendarComponent
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
            modifiers={{
              productive: (date) => {
                const day = date.toISOString().split('T')[0];
                return metrics?.date === day && (metrics?.productivity_score || 0) > 3;
              },
            }}
            modifiersClassNames={{
              productive: 'bg-primary/20 font-bold',
            }}
          />
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-6">Daily Summary</h2>
          {date && (
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Focus Time</p>
                <p className="text-2xl font-bold">
                  {metrics?.focus_time ? `${Math.round(metrics.focus_time / 60)}h ${metrics.focus_time % 60}m` : '-'}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Deep Work Sessions</p>
                <p className="text-2xl font-bold">
                  {metrics?.deep_work_sessions || '-'}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Energy Level</p>
                <p className="text-2xl font-bold">
                  {metrics?.energy_level ? `${metrics.energy_level}/5` : '-'}
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}