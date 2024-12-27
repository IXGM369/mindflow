/*
  # Focus tracking schema

  1. New Tables
    - `focus_sessions`
      - Stores individual focus/pomodoro sessions
      - Includes duration, type, ratings, and notes
    - `daily_metrics`
      - Tracks daily productivity metrics
      - Aggregates focus time and session counts
    - `weekly_reflections`
      - Stores weekly reviews and reflections
      - Includes achievements, goals, and ratings

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Focus sessions table
CREATE TABLE IF NOT EXISTS focus_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  start_time TIMESTAMPTZ NOT NULL DEFAULT now(),
  end_time TIMESTAMPTZ,
  duration INTEGER NOT NULL, -- in minutes
  session_type TEXT NOT NULL CHECK (session_type IN ('deep_work', 'pomodoro')),
  focus_score INTEGER CHECK (focus_score >= 1 AND focus_score <= 5),
  energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 5),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Daily metrics table
CREATE TABLE IF NOT EXISTS daily_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  focus_time INTEGER DEFAULT 0, -- in minutes
  deep_work_sessions INTEGER DEFAULT 0,
  energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 5),
  productivity_score INTEGER CHECK (productivity_score >= 1 AND productivity_score <= 5),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Weekly reflections table
CREATE TABLE IF NOT EXISTS weekly_reflections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  week_start DATE NOT NULL,
  achievements TEXT[],
  improvements TEXT[],
  distractions TEXT[],
  next_week_goals TEXT[],
  energy_score INTEGER CHECK (energy_score >= 1 AND energy_score <= 5),
  productivity_score INTEGER CHECK (productivity_score >= 1 AND productivity_score <= 5),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, week_start)
);

-- Enable RLS
ALTER TABLE focus_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_reflections ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their own focus sessions"
  ON focus_sessions
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own daily metrics"
  ON daily_metrics
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own weekly reflections"
  ON weekly_reflections
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);