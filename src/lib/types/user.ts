export interface UserMetadata {
  id: string;
  full_name: string | null;
  preferences: {
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
  };
  created_at: string;
  updated_at: string;
}

export interface FocusSession {
  id: string;
  user_id: string;
  start_time: string;
  end_time: string | null;
  duration: number;
  session_type: 'deep_work' | 'pomodoro';
  focus_score: number | null;
  energy_level: number | null;
  notes: string | null;
  created_at: string;
}

export interface WeeklyReflection {
  id: string;
  user_id: string;
  week_start: string;
  achievements: string[];
  improvements: string[];
  distractions: string[];
  next_week_goals: string[];
  energy_score: number;
  productivity_score: number;
  created_at: string;
}

export interface DailyMetric {
  id: string;
  user_id: string;
  date: string;
  focus_time: number;
  deep_work_sessions: number;
  energy_level: number;
  productivity_score: number;
  created_at: string;
}