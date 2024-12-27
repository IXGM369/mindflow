import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ReactNode } from 'react';

interface MetricCardProps {
  icon: ReactNode;
  title: string;
  value: string;
  target: string;
  progress: number;
}

export function MetricCard({ icon, title, value, target, progress }: MetricCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h3 className="font-medium">{title}</h3>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-2xl font-semibold">{value}</span>
          <span className="text-sm text-muted-foreground">Target: {target}</span>
        </div>
        <Progress value={Math.min(progress, 100)} />
      </div>
    </Card>
  );
}