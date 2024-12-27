import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { getFocusSessions } from '@/lib/focus-sessions';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { FocusSession } from '@/lib/types/focus';

export default function SessionHistory() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<FocusSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const loadSessions = async () => {
      try {
        const data = await getFocusSessions(user.id);
        setSessions(data);
      } catch (error) {
        console.error('Failed to load sessions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSessions();
  }, [user]);

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="h-[300px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 space-y-4">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Recent Sessions</h2>
        <p className="text-sm text-muted-foreground">
          Track your focus sessions and progress
        </p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Focus</TableHead>
            <TableHead>Energy</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sessions.map((session) => (
            <TableRow key={session.id}>
              <TableCell>
                {new Date(session.start_time).toLocaleDateString()}
              </TableCell>
              <TableCell>{session.duration} min</TableCell>
              <TableCell>{session.focus_score ? `${session.focus_score}/5` : '-'}</TableCell>
              <TableCell>{session.energy_level ? `${session.energy_level}/5` : '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}