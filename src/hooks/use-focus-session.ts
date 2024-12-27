import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { createFocusSession, updateFocusSession } from '@/lib/focus-sessions';
import { updateDailyMetrics } from '@/lib/api/metrics';
import { toast } from 'sonner';

export function useFocusSession() {
  const { user } = useAuth();
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(25 * 60); // 25 minutes in seconds
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    let interval: number;

    if (isRunning && time > 0) {
      interval = window.setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      setIsRunning(false);
      handleSessionComplete();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, time]);

  const startSession = async (duration: number) => {
    if (!user) return;

    try {
      const session = await createFocusSession(user.id, {
        duration: Math.floor(duration / 60),
        session_type: 'pomodoro',
        start_time: new Date().toISOString(),
        end_time: null,
      });
      setSessionId(session.id);
      setIsRunning(true);
    } catch (error) {
      toast.error('Failed to start session');
      console.error(error);
    }
  };

  const handleSessionComplete = async () => {
    if (!user || !sessionId) return;

    try {
      const session = await updateFocusSession(sessionId, user.id, {
        end_time: new Date().toISOString(),
      });

      // Update daily metrics
      await updateDailyMetrics(user.id, {
        focus_time: session.duration,
        deep_work_sessions: session.duration >= 25 ? 1 : 0,
      });

      toast.success('Session completed!');
    } catch (error) {
      toast.error('Failed to save session');
      console.error(error);
    }
  };

  const pauseSession = () => {
    setIsRunning(false);
  };

  const resumeSession = () => {
    setIsRunning(true);
  };

  const resetSession = () => {
    setTime(25 * 60);
    setIsRunning(false);
    setSessionId(null);
  };

  return {
    isRunning,
    time,
    sessionId,
    startSession,
    pauseSession,
    resumeSession,
    resetSession,
  };
}