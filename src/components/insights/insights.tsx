import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useMetrics } from '@/hooks/use-metrics';
import { Brain, Zap, Battery, TrendingUp } from 'lucide-react';

export default function Insights() {
  const { metrics } = useMetrics();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Insights</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <InsightCard
          icon={<Brain className="w-5 h-5" />}
          title="Focus Score"
          value={metrics?.productivity_score || 0}
          total={5}
          description="Your average focus quality"
        />
        <InsightCard
          icon={<Zap className="w-5 h-5" />}
          title="Productivity"
          value={85}
          total={100}
          description="Task completion rate"
        />
        <InsightCard
          icon={<Battery className="w-5 h-5" />}
          title="Energy Level"
          value={metrics?.energy_level || 0}
          total={5}
          description="Average daily energy"
        />
        <InsightCard
          icon={<TrendingUp className="w-5 h-5" />}
          title="Growth"
          value={92}
          total={100}
          description="Weekly improvement"
        />
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Personalized Recommendations</h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium">Optimize Your Peak Hours</h3>
            <p className="text-sm text-muted-foreground">
              Your data shows higher focus levels during morning hours. Consider scheduling important tasks between 9 AM and 11 AM.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

interface InsightCardProps {
  icon: React.ReactNode;
  title: string;
  value: number;
  total: number;
  description: string;
}

function InsightCard({ icon, title, value, total, description }: InsightCardProps) {
  const percentage = (value / total) * 100;

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h3 className="font-medium">{title}</h3>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-2xl font-semibold">{value}</span>
          <span className="text-sm text-muted-foreground">/ {total}</span>
        </div>
        <Progress value={percentage} />
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </Card>
  );
}