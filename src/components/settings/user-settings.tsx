import { useState } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { updateUserMetadata, signOut } from '@/lib/auth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useTheme } from '@/components/theme-provider';
import { useNavigate } from 'react-router-dom';
import { LogOut, Moon, Sun, Monitor, Bell, Clock, Brain } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

export default function UserSettings() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: user?.email || '',
    notifications: {
      focusReminders: true,
      weeklyReview: true,
      achievements: true,
      systemUpdates: true,
    },
    preferences: {
      focusTime: 25,
      breakTime: 5,
      autoStartBreaks: true,
      soundEffects: true,
      darkMode: theme === 'dark',
    },
    accessibility: {
      highContrast: false,
      largeText: false,
      reduceMotion: false,
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    try {
      await updateUserMetadata(user.id, {
        full_name: formData.fullName,
        preferences: {
          theme,
          notifications: formData.notifications,
          focus: {
            defaultDuration: formData.preferences.focusTime,
            breakDuration: formData.preferences.breakTime,
            autoStartBreaks: formData.preferences.autoStartBreaks,
            soundEffects: formData.preferences.soundEffects,
          },
          accessibility: formData.accessibility,
        }
      });
      toast.success('Settings updated successfully');
    } catch (error) {
      toast.error('Failed to update settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <Button variant="destructive" onClick={handleSignOut}>
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  disabled
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    fullName: e.target.value
                  }))}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Theme</h3>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={theme === 'light' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTheme('light')}
                    className="w-full"
                  >
                    <Sun className="w-4 h-4 mr-2" />
                    Light
                  </Button>
                  <Button
                    type="button"
                    variant={theme === 'dark' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTheme('dark')}
                    className="w-full"
                  >
                    <Moon className="w-4 h-4 mr-2" />
                    Dark
                  </Button>
                  <Button
                    type="button"
                    variant={theme === 'system' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTheme('system')}
                    className="w-full"
                  >
                    <Monitor className="w-4 h-4 mr-2" />
                    System
                  </Button>
                </div>
              </div>

              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="p-6">
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Notification Preferences</h3>
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
                    checked={formData.notifications.focusReminders}
                    onCheckedChange={(checked) =>
                      setFormData(prev => ({
                        ...prev,
                        notifications: {
                          ...prev.notifications,
                          focusReminders: checked
                        }
                      }))
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
                    checked={formData.notifications.weeklyReview}
                    onCheckedChange={(checked) =>
                      setFormData(prev => ({
                        ...prev,
                        notifications: {
                          ...prev.notifications,
                          weeklyReview: checked
                        }
                      }))
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
                    checked={formData.notifications.achievements}
                    onCheckedChange={(checked) =>
                      setFormData(prev => ({
                        ...prev,
                        notifications: {
                          ...prev.notifications,
                          achievements: checked
                        }
                      }))
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
                    checked={formData.notifications.systemUpdates}
                    onCheckedChange={(checked) =>
                      setFormData(prev => ({
                        ...prev,
                        notifications: {
                          ...prev.notifications,
                          systemUpdates: checked
                        }
                      }))
                    }
                  />
                </div>
              </div>

              <Button onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="preferences">
          <Card className="p-6">
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Focus Settings</h3>
                <p className="text-sm text-muted-foreground">
                  Customize your focus session preferences
                </p>
              </div>

              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <Label>Default Focus Duration</Label>
                      <p className="text-sm text-muted-foreground">
                        Set your preferred focus session length
                      </p>
                    </div>
                    <span className="text-sm font-medium">
                      {formData.preferences.focusTime} minutes
                    </span>
                  </div>
                  <Slider
                    value={[formData.preferences.focusTime]}
                    onValueChange={([value]) =>
                      setFormData(prev => ({
                        ...prev,
                        preferences: {
                          ...prev.preferences,
                          focusTime: value
                        }
                      }))
                    }
                    min={5}
                    max={60}
                    step={5}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <Label>Break Duration</Label>
                      <p className="text-sm text-muted-foreground">
                        Set your preferred break length
                      </p>
                    </div>
                    <span className="text-sm font-medium">
                      {formData.preferences.breakTime} minutes
                    </span>
                  </div>
                  <Slider
                    value={[formData.preferences.breakTime]}
                    onValueChange={([value]) =>
                      setFormData(prev => ({
                        ...prev,
                        preferences: {
                          ...prev.preferences,
                          breakTime: value
                        }
                      }))
                    }
                    min={1}
                    max={15}
                    step={1}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-start Breaks</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically start breaks after focus sessions
                    </p>
                  </div>
                  <Switch
                    checked={formData.preferences.autoStartBreaks}
                    onCheckedChange={(checked) =>
                      setFormData(prev => ({
                        ...prev,
                        preferences: {
                          ...prev.preferences,
                          autoStartBreaks: checked
                        }
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Sound Effects</Label>
                    <p className="text-sm text-muted-foreground">
                      Play sounds for timer notifications
                    </p>
                  </div>
                  <Switch
                    checked={formData.preferences.soundEffects}
                    onCheckedChange={(checked) =>
                      setFormData(prev => ({
                        ...prev,
                        preferences: {
                          ...prev.preferences,
                          soundEffects: checked
                        }
                      }))
                    }
                  />
                </div>
              </div>

              <Button onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="accessibility">
          <Card className="p-6">
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Accessibility Settings</h3>
                <p className="text-sm text-muted-foreground">
                  Customize your experience to make the app more accessible
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>High Contrast</Label>
                    <p className="text-sm text-muted-foreground">
                      Increase contrast for better visibility
                    </p>
                  </div>
                  <Switch
                    checked={formData.accessibility.highContrast}
                    onCheckedChange={(checked) =>
                      setFormData(prev => ({
                        ...prev,
                        accessibility: {
                          ...prev.accessibility,
                          highContrast: checked
                        }
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Large Text</Label>
                    <p className="text-sm text-muted-foreground">
                      Increase text size throughout the app
                    </p>
                  </div>
                  <Switch
                    checked={formData.accessibility.largeText}
                    onCheckedChange={(checked) =>
                      setFormData(prev => ({
                        ...prev,
                        accessibility: {
                          ...prev.accessibility,
                          largeText: checked
                        }
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Reduce Motion</Label>
                    <p className="text-sm text-muted-foreground">
                      Minimize animations and transitions
                    </p>
                  </div>
                  <Switch
                    checked={formData.accessibility.reduceMotion}
                    onCheckedChange={(checked) =>
                      setFormData(prev => ({
                        ...prev,
                        accessibility: {
                          ...prev.accessibility,
                          reduceMotion: checked
                        }
                      }))
                    }
                  />
                </div>
              </div>

              <Button onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}