import { useState, useEffect } from 'react';
import { Timer, PauseCircle, PlayCircle, RotateCcw } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { useFocusTracker } from '@/hooks/use-focus-tracker';
import FocusRating from './focus-rating';
import SessionHistory from './session-history';

export default function DailyFocus() {
  const {
    isTracking,
    startTracking,
    stopTracking,
    sessionId,
  } = useFocusTracker();
  const [showRating, setShowRating] = useState(false);
  const [duration, setDuration] = useState(25);
  const [timeLeft, setTimeLeft] = useState(duration * 60);

  useEffect(() => {
    let interval: number;

    if (isTracking && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            stopTracking();
            setShowRating(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTracking, timeLeft, stopTracking]);

  const handleStartPause = () => {
    if (isTracking) {
      stopTracking();
    } else {
      startTracking(duration);
      setTimeLeft(duration * 60);
    }
  };

  const handleReset = () => {
    if (isTracking) {
      stopTracking();
    }
    setTimeLeft(duration * 60);
    setShowRating(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Daily Focus</h1>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-4 md:p-6 space-y-6">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Focus Timer</h2>
            <p className="text-sm text-muted-foreground">
              Set your focus duration and stay in the zone
            </p>
          </div>

          <div className="flex justify-center">
            <div className="w-36 h-36 md:w-48 md:h-48 rounded-full border-8 border-primary/20 flex items-center justify-center relative">
              <Timer className="w-6 h-6 absolute top-8 text-primary" />
              <span className="text-3xl md:text-4xl font-bold">{formatTime(timeLeft)}</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Duration</span>
                <span>{duration} minutes</span>
              </div>
              <Slider
                defaultValue={[25]}
                min={5}
                max={120}
                step={5}
                onValueChange={(value) => setDuration(value[0])}
                disabled={isTracking}
              />
            </div>

            <div className="flex justify-center gap-2">
              <Button
                size="lg"
                variant={isTracking ? 'outline' : 'default'}
                onClick={handleStartPause}
                className="w-full sm:w-auto"
              >
                {isTracking ? (
                  <>
                    <PauseCircle className="mr-2 h-4 w-4" /> Pause
                  </>
                ) : (
                  <>
                    <PlayCircle className="mr-2 h-4 w-4" /> Start
                  </>
                )}
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={handleReset}
                className="w-full sm:w-auto"
              >
                <RotateCcw className="mr-2 h-4 w-4" /> Reset
              </Button>
            </div>
          </div>

          <Progress value={(timeLeft / (duration * 60)) * 100} className="h-2" />
        </Card>

        <div className="hidden lg:block">
          <SessionHistory />
        </div>
      </div>

      <div className="block lg:hidden">
        <SessionHistory />
      </div>

      {showRating && sessionId && (
        <FocusRating 
          sessionId={sessionId} 
          duration={duration} 
          onClose={() => setShowRating(false)} 
        />
      )}
    </div>
  );
}