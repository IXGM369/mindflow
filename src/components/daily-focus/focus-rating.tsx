import { useState } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { updateFocusSession } from '@/lib/focus-sessions';
import { updateDailyMetrics } from '@/lib/api/metrics';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';

interface FocusRatingProps {
  sessionId: string;
  duration: number;
  onClose: () => void;
}

export default function FocusRating({ sessionId, duration, onClose }: FocusRatingProps) {
  const { user } = useAuth();
  const [focusScore, setFocusScore] = useState<string>('');
  const [energyLevel, setEnergyLevel] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!user || !sessionId) return;
    
    setIsSubmitting(true);
    try {
      // Update the focus session with ratings
      await updateFocusSession(sessionId, user.id, {
        focus_score: parseInt(focusScore),
        energy_level: parseInt(energyLevel),
        notes,
        end_time: new Date().toISOString(),
      });

      // Update daily metrics
      await updateDailyMetrics(user.id, {
        focus_time: duration,
        deep_work_sessions: duration >= 25 ? 1 : 0,
        energy_level: parseInt(energyLevel),
        productivity_score: parseInt(focusScore),
      });

      toast.success('Session completed and rated!');
      onClose();
    } catch (error) {
      toast.error('Failed to save rating');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rate Your Focus Session</DialogTitle>
          <DialogDescription>
            How was your focus during this session? This helps track your productivity patterns.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-4">
            <Label>Focus Score</Label>
            <RadioGroup
              onValueChange={setFocusScore}
              className="flex justify-between"
            >
              {[1, 2, 3, 4, 5].map((value) => (
                <div key={value} className="space-y-2 text-center">
                  <RadioGroupItem
                    value={value.toString()}
                    id={`focus-${value}`}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={`focus-${value}`}
                    className="block p-2 cursor-pointer rounded peer-checked:bg-primary peer-checked:text-primary-foreground"
                  >
                    {value}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-4">
            <Label>Energy Level</Label>
            <RadioGroup
              onValueChange={setEnergyLevel}
              className="flex justify-between"
            >
              {[1, 2, 3, 4, 5].map((value) => (
                <div key={value} className="space-y-2 text-center">
                  <RadioGroupItem
                    value={value.toString()}
                    id={`energy-${value}`}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={`energy-${value}`}
                    className="block p-2 cursor-pointer rounded peer-checked:bg-primary peer-checked:text-primary-foreground"
                  >
                    {value}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Notes (Optional)</Label>
            <Textarea
              placeholder="What helped or hindered your focus?"
              className="resize-none"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={!focusScore || !energyLevel || isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Rating'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}