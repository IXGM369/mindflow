import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Video, Headphones, Link } from 'lucide-react';

export default function Resources() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Resources</h1>

      <Tabs defaultValue="articles" className="space-y-6">
        <TabsList>
          <TabsTrigger value="articles">Articles</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="podcasts">Podcasts</TabsTrigger>
        </TabsList>

        <TabsContent value="articles" className="space-y-4">
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold">The Science of Focus</h3>
                <p className="text-sm text-muted-foreground">
                  Learn about the neuroscience behind focused work and how to optimize your brain for deep concentration.
                </p>
              </div>
              <FileText className="w-5 h-5 text-muted-foreground" />
            </div>
            <Button variant="link" className="px-0 mt-2">Read more</Button>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}