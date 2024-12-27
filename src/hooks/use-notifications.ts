import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { getNotifications, markAsRead } from '@/lib/api/notifications';
import type { Notification } from '@/lib/types/notifications';

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const loadNotifications = async () => {
      try {
        const data = await getNotifications(user.id);
        setNotifications(data);
      } catch (error) {
        console.error('Failed to load notifications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadNotifications();
  }, [user]);

  const markNotificationAsRead = async (notificationId: string) => {
    if (!user) return;

    try {
      await markAsRead(user.id, notificationId);
      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  return {
    notifications,
    isLoading,
    markAsRead: markNotificationAsRead,
  };
}