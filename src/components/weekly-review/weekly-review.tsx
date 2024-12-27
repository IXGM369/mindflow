import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';
import WeeklyStats from './weekly-stats';
import WeeklyJournal from './weekly-journal';
import { useReflection } from '@/hooks/use-reflection';
import { generatePDF } from '@/lib/pdf';

export default function WeeklyReview() {
  const { reflection } = useReflection();

  const handleExportPDF = async () => {
    if (!reflection) return;
    await generatePDF(reflection);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Weekly Review</h1>
        <Button onClick={handleExportPDF} disabled={!reflection}>
          <FileDown className="w-4 h-4 mr-2" />
          Export PDF
        </Button>
      </div>

      <Tabs defaultValue="stats" className="space-y-6">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="stats">Statistics</TabsTrigger>
          <TabsTrigger value="journal">Journal</TabsTrigger>
        </TabsList>

        <TabsContent value="stats" className="space-y-6">
          <WeeklyStats />
        </TabsContent>

        <TabsContent value="journal">
          <Card className="p-4 md:p-6">
            <WeeklyJournal />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}