/*
  # Initial Schema Setup for Productivity App

  1. New Tables
    - users_metadata
      - Extended user profile data
      - Linked to auth.users
    - focus_sessions
      - Records deep work sessions
      - Tracks duration, type, and effectiveness
    - weekly_reflections
      - Stores weekly review data
      - Includes achievements and improvements
    - daily_metrics
      - Tracks daily productivity metrics
      - Stores focus scores and energy levels

  2. Security
    - Enable RLS on all tables
    - Policies for user-specific data access
*/

-- Users metadata table
CREATE TABLE users_metadata (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  preferences JSONB DEFAULT '{"theme": "system", "notifications": true}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Focus sessions table
CREATE TABLE focus_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  start_time TIMESTAMPTZ NOT NULL DEFAULT now(),
  end_time TIMESTAMPTZ,
  duration INTEGER, -- in minutes
  session_type TEXT NOT NULL, -- 'deep_work', 'pomodoro'
  focus_score INTEGER CHECK (focus_score >= 1 AND focus_score <= 10),
  energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 10),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Weekly reflections table
CREATE TABLE weekly_reflections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  week_start DATE NOT NULL,
  achievements TEXT[],
  improvements TEXT[],
  distractions TEXT[],
  next_week_goals TEXT[],
  energy_score INTEGER CHECK (energy_score >= 1 AND energy_score <= 10),
  productivity_score INTEGER CHECK (productivity_score >= 1 AND productivity_score <= 10),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Daily metrics table
CREATE TABLE daily_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  focus_time INTEGER DEFAULT 0, -- in minutes
  deep_work_sessions INTEGER DEFAULT 0,
  energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 10),
  productivity_score INTEGER CHECK (productivity_score >= 1 AND productivity_score <= 10),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE focus_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_reflections ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_metrics ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own metadata"
  ON users_metadata FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own metadata"
  ON users_metadata FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can read own focus sessions"
  ON focus_sessions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own focus sessions"
  ON focus_sessions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own weekly reflections"
  ON weekly_reflections FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own weekly reflections"
  ON weekly_reflections FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own daily metrics"
  ON daily_metrics FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own daily metrics"
  ON daily_metrics FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);