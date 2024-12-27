import { useState } from 'react';
import { useReflection } from '@/hooks/use-reflection';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function WeeklyJournal() {
  const { reflection, updateReflection } = useReflection();
  const [isEditing, setIsEditing] = useState(true);
  const [formData, setFormData] = useState({
    achievements: reflection?.achievements?.join('\n') || '',
    improvements: reflection?.improvements?.join('\n') || '',
    distractions: reflection?.distractions?.join('\n') || '',
    nextWeek: reflection?.next_week_goals?.join('\n') || '',
  });

  const handleSave = async () => {
    try {
      await updateReflection({
        achievements: formData.achievements.split('\n').filter(Boolean),
        improvements: formData.improvements.split('\n').filter(Boolean),
        distractions: formData.distractions.split('\n').filter(Boolean),
        next_week_goals: formData.nextWeek.split('\n').filter(Boolean),
      });
      setIsEditing(false);
      toast.success('Journal saved successfully');
    } catch (error) {
      toast.error('Failed to save journal');
    }
  };

  const questions = [
    {
      id: 'achievements',
      label: 'What were your key achievements this week?',
      placeholder: 'List your main accomplishments and wins...',
      value: formData.achievements,
    },
    {
      id: 'improvements',
      label: 'What could be improved?',
      placeholder: 'Areas where you faced challenges or see room for growth...',
      value: formData.improvements,
    },
    {
      id: 'distractions',
      label: 'What were your biggest distractions?',
      placeholder: 'Identify patterns and obstacles to focus...',
      value: formData.distractions,
    },
    {
      id: 'nextWeek',
      label: 'Focus areas for next week',
      placeholder: 'Set clear intentions and priorities...',
      value: formData.nextWeek,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Weekly Reflection</h2>
        <Button
          variant="outline"
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
        >
          {isEditing ? 'Save' : 'Edit'}
        </Button>
      </div>

      <div className="space-y-8">
        {questions.map((question) => (
          <div key={question.id} className="space-y-2">
            <Label>{question.label}</Label>
            <Textarea
              placeholder={question.placeholder}
              disabled={!isEditing}
              value={question.value}
              onChange={(e) => 
                setFormData(prev => ({
                  ...prev,
                  [question.id]: e.target.value
                }))
              }
              className="resize-none min-h-[100px]"
            />
          </div>
        ))}
      </div>
    </div>
  );
}