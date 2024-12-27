import { useAuth } from '@/components/auth/auth-provider';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '@/components/layout/layout';
import Dashboard from '@/components/dashboard/dashboard';
import DailyFocus from '@/components/daily-focus/daily-focus';
import WeeklyReview from '@/components/weekly-review/weekly-review';
import Calendar from '@/components/calendar/calendar';
import KnowledgeBase from '@/components/knowledge/knowledge-base';
import Resources from '@/components/resources/resources';
import Insights from '@/components/insights/insights';
import Analytics from '@/components/analytics/analytics';
import UserSettings from '@/components/settings/user-settings';
import AuthForm from '@/components/auth/auth-form';
import { BrainCog } from 'lucide-react';

export default function AppContent() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
        <AuthForm />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Layout
        appName="Mindflow"
        appIcon={<BrainCog className="w-6 h-6" />}
      >
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/focus" element={<DailyFocus />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/knowledge" element={<KnowledgeBase />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/review" element={<WeeklyReview />} />
          <Route path="/settings" element={<UserSettings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </div>
  );
}