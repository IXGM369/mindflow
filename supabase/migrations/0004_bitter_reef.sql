/*
  # Fix metrics defaults and notifications

  1. Changes
    - Add default values for metrics columns
    - Drop existing policy if it exists to avoid conflicts
    
  2. Security
    - Recreate notifications policy safely
*/

-- Fix daily metrics to handle empty results better
ALTER TABLE daily_metrics 
  ALTER COLUMN focus_time SET DEFAULT 0,
  ALTER COLUMN deep_work_sessions SET DEFAULT 0,
  ALTER COLUMN energy_level SET DEFAULT 0,
  ALTER COLUMN productivity_score SET DEFAULT 0;

-- Drop existing policy if it exists
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'notifications' 
    AND policyname = 'Users can manage their own notifications'
  ) THEN
    DROP POLICY "Users can manage their own notifications" ON notifications;
  END IF;
END $$;

-- Create RLS policy
CREATE POLICY "Users can manage their own notifications"
  ON notifications
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);