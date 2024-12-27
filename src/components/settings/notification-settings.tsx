import { useState } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { updateUserPreferences } from '@/lib/api/user';
import { toast } from 'sonner';

export default function NotificationSettings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    focusReminders: true,
    weeklyReview: true,
    achievements: true,
    systemUpdates: true,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!user) return;
    setIsLoading(true);
    
    try {
      await updateUserPreferences(user.id, {
        notifications: settings,
      });
      toast.success('Notification settings updated');
    } catch (error) {
      toast.error('Failed to update settings');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Notification Preferences</h2>
          <p className="text-sm text-muted-foreground">
            Choose what notifications you want to receive
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Focus Reminders</Label>
              <p className="text-sm text-muted-foreground">
                Get reminded about scheduled focus sessions
              </p>
            </div>
            <Switch
              checked={settings.focusReminders}
              onCheckedChange={(checked) =>
                setSettings((prev) => ({ ...prev, focusReminders: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Weekly Review</Label>
              <p className="text-sm text-muted-foreground">
                Reminders for weekly reflection and planning
              </p>
            </div>
            <Switch
              checked={settings.weeklyReview}
              onCheckedChange={(checked) =>
                setSettings((prev) => ({ ...prev, weeklyReview: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Achievements</Label>
              <p className="text-sm text-muted-foreground">
                Notifications about milestones and achievements
              </p>
            </div>
            <Switch
              checked={settings.achievements}
              onCheckedChange={(checked) =>
                setSettings((prev) => ({ ...prev, achievements: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>System Updates</Label>
              <p className="text-sm text-muted-foreground">
                Important updates and announcements
              </p>
            </div>
            <Switch
              checked={settings.systemUpdates}
              onCheckedChange={(checked) =>
                setSettings((prev) => ({ ...prev, systemUpdates: checked }))
              }
            />
          </div>
        </div>

        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </Card>
  );
}