import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { getWeeklyReflection, saveWeeklyReflection } from '@/lib/api/reflections';
import type { WeeklyReflection } from '@/lib/types/focus';

export function useReflection() {
  const { user } = useAuth();
  const [reflection, setReflection] = useState<WeeklyReflection | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const loadReflection = async () => {
      try {
        const data = await getWeeklyReflection(user.id);
        setReflection(data || null);
      } catch (error) {
        console.error('Failed to load reflection:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadReflection();
  }, [user]);

  const updateReflection = async (updates: Partial<WeeklyReflection>) => {
    if (!user) return;

    try {
      const updated = await saveWeeklyReflection(user.id, updates);
      setReflection(updated);
      return updated;
    } catch (error) {
      console.error('Failed to update reflection:', error);
      throw error;
    }
  };

  return {
    reflection,
    isLoading,
    updateReflection,
  };
}