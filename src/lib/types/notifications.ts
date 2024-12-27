export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'focus' | 'achievement' | 'system' | 'review';
  read: boolean;
  created_at: string;
}