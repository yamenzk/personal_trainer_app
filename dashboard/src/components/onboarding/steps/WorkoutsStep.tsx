import { useState } from 'react';
import { Button, Chip } from "@nextui-org/react";
import { Calendar, Clock, Dumbbell, Trophy, ChartBar, Check } from 'lucide-react';
import { cn } from '@/utils/cn';

interface WorkoutsStepProps {
  onComplete: (value: number) => void;
  isLoading?: boolean;
}

// Define day type for type safety
type WeekDay = 'Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat';
const WEEK_DAYS: WeekDay[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const WorkoutsStep = ({ onComplete, isLoading = false }: WorkoutsStepProps) => {
  const [selected, setSelected] = useState<number | null>(null);
  const [error, setError] = useState('');

  const workoutOptions = [
    {
      value: 3,
      title: '3 Workouts',
      description: 'Beginner Friendly',
      schedule: ['Mon', 'Wed', 'Fri'] as WeekDay[],
      duration: '45-60 min',
      intensity: 1,
      color: 'primary',
      features: ['Perfect for beginners', 'Good recovery time', 'Balanced lifestyle']
    },
    {
      value: 4,
      title: '4 Workouts',
      description: 'Balanced Approach',
      schedule: ['Mon', 'Tue', 'Thu', 'Fri'] as WeekDay[],
      duration: '45-60 min',
      intensity: 2,
      color: 'secondary',
      features: ['Consistent progress', 'Flexible schedule', 'Good results']
    },
    {
      value: 5,
      title: '5 Workouts',
      description: 'Intermediate Level',
      schedule: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] as WeekDay[],
      duration: '60-75 min',
      intensity: 3,
      color: 'success',
      features: ['Faster results', 'Better conditioning', 'Strength gains']
    },
    {
      value: 6,
      title: '6 Workouts',
      description: 'Advanced Training',
      schedule: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as WeekDay[],
      duration: '60-90 min',
      intensity: 4,
      color: 'warning',
      features: ['Maximum results', 'Athletic performance', 'Body recomposition']
    }
  ] as const;

  const handleSubmit = () => {
    if (!selected) {
      setError('Please select your preferred workout frequency');
      return;
    }
    onComplete(selected);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-3">
        {workoutOptions.map(({
          value,
          title,
          description,
          schedule,
          duration,
          intensity,
          color,
          features
        }) => (
          <button
            key={value}
            onClick={() => {
              setSelected(value);
              setError('');
            }}
            className={cn(
              "w-full text-left",
              "p-4 rounded-xl",
              "transition-all duration-150",
              "active:scale-[0.98]",
              "outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
              selected === value 
                ? `bg-${color}-500/20 ring-2 ring-${color}-500` 
                : 'bg-content/5 hover:bg-content/10'
            )}
          >
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-medium flex items-center gap-2">
                    {title}
                    {selected === value && (
                      <Check size={16} className={`text-${color}-500`} />
                    )}
                  </h3>
                  <p className="text-sm text-foreground/60">{description}</p>
                </div>

                {/* Intensity Indicator */}
                <div className="flex gap-1">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        "w-1 h-4 rounded-full transition-colors duration-150",
                        i < intensity
                          ? selected === value
                            ? `bg-${color}-500`
                            : `bg-${color}-500/40`
                          : 'bg-content/10'
                      )}
                    />
                  ))}
                </div>
              </div>

              {/* Schedule Days */}
              <div className="flex gap-1.5">
                {WEEK_DAYS.map((day) => (
                  <div
                    key={day}
                    className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center text-xs",
                      "transition-colors duration-150",
                      schedule.includes(day)
                        ? selected === value
                          ? `bg-${color}-500 text-white`
                          : `bg-${color}-500/20 text-${color}-500`
                        : 'bg-content/5 text-foreground/40'
                    )}
                  >
                    {day[0]}
                  </div>
                ))}
              </div>

              {/* Features */}
              <div className="flex flex-wrap items-center gap-2">
                <Chip
                  size="sm"
                  startContent={<Clock size={14} />}
                  className={cn(
                    "transition-colors duration-150",
                    selected === value
                      ? `bg-${color}-500/20 text-${color}-500`
                      : 'bg-content/10'
                  )}
                >
                  {duration}
                </Chip>
                {features.map((feature, index) => (
                  <Chip
                    key={index}
                    size="sm"
                    className={cn(
                      "transition-colors duration-150",
                      selected === value
                        ? `bg-${color}-500/20 text-${color}-500`
                        : 'bg-content/10'
                    )}
                  >
                    {feature}
                  </Chip>
                ))}
              </div>
            </div>
          </button>
        ))}
      </div>

      {error && (
        <p className="text-danger text-sm text-center">{error}</p>
      )}

      <Button
        color="primary"
        size="lg"
        className="w-full bg-gradient-to-r from-primary-500 to-secondary-500"
        onPress={handleSubmit}
        isLoading={isLoading}
      >
        Continue
      </Button>
    </div>
  );
};

export default WorkoutsStep;