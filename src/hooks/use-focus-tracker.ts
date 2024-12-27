import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { useMetricsStore } from './use-metrics-store';
import { createFocusSession, updateFocusSession } from '@/lib/focus-sessions';
import { updateDailyMetrics } from '@/lib/api/metrics';
import { toast } from 'sonner';

export function useFocusTracker() {
  const { user } = useAuth();
  const [isTracking, setIsTracking] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const updateFocusTime = useMetricsStore((state) => state.updateFocusTime);
  const updateDeepWorkSessions = useMetricsStore((state) => state.updateDeepWorkSessions);

  const startTracking = useCallback(async (duration: number) => {
    if (!user) return;

    try {
      const session = await createFocusSession(user.id, {
        duration,
        session_type: duration >= 25 ? 'deep_work' : 'pomodoro',
        start_time: new Date().toISOString(),
        end_time: null,
      });

      setSessionId(session.id);
      setStartTime(new Date());
      setIsTracking(true);
    } catch (error) {
      toast.error('Failed to start focus session');
      console.error(error);
    }
  }, [user]);

  const stopTracking = useCallback(async () => {
    if (!user || !sessionId || !startTime) return;

    try {
      const endTime = new Date();
      const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 60000); // minutes

      await updateFocusSession(sessionId, user.id, {
        end_time: endTime.toISOString(),
      });

      // Update metrics
      updateFocusTime(duration);
      if (duration >= 25) {
        updateDeepWorkSessions(1);
      }

      // Sync with backend
      await updateDailyMetrics(user.id, {
        focus_time: duration,
        deep_work_sessions: duration >= 25 ? 1 : 0,
      });

      setIsTracking(false);
      setSessionId(null);
      setStartTime(null);
    } catch (error) {
      toast.error('Failed to stop focus session');
      console.error(error);
    }
  }, [user, sessionId, startTime, updateFocusTime, updateDeepWorkSessions]);

  useEffect(() => {
    return () => {
      if (isTracking) {
        stopTracking();
      }
    };
  }, [isTracking, stopTracking]);

  return {
    isTracking,
    startTracking,
    stopTracking,
    sessionId,
  };
}