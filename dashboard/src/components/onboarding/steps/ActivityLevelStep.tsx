import { useState } from 'react';
import { Button } from "@nextui-org/react";
import { Armchair, Footprints, Rabbit, Dumbbell, Zap } from 'lucide-react';
import { cn } from '@/utils/cn';

interface ActivityLevelStepProps {
  onComplete: (value: string) => void;
  isLoading?: boolean;
}

const ActivityLevelStep = ({ onComplete, isLoading = false }: ActivityLevelStepProps) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [error, setError] = useState('');

  const activityLevels = [
    {
      value: 'Sedentary',
      title: 'Sedentary',
      description: 'Little to no exercise, desk job',
      icon: Armchair,
      color: 'default',
      intensity: 1,
    },
    {
      value: 'Light',
      title: 'Lightly Active',
      description: 'Light exercise 1-3 days/week',
      icon: Footprints,
      color: 'primary',
      intensity: 2,
    },
    {
      value: 'Moderate',
      title: 'Moderately Active',
      description: 'Moderate exercise 3-5 days/week',
      icon: Rabbit,
      color: 'secondary',
      intensity: 3,
    },
    {
      value: 'Very Active',
      title: 'Very Active',
      description: 'Hard exercise 6-7 days/week',
      icon: Dumbbell,
      color: 'success',
      intensity: 4,
    },
    {
      value: 'Extra Active',
      title: 'Extra Active',
      description: 'Very hard exercise & physical job',
      icon: Zap,
      color: 'warning',
      intensity: 5,
    },
  ] as const;

  const handleSubmit = () => {
    if (!selected) {
      setError('Please select your activity level');
      return;
    }
    onComplete(selected);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        {activityLevels.map(({ value, title, description, icon: Icon, color, intensity }) => (
          <button
            key={value}
            onClick={() => {
              setSelected(value);
              setError('');
            }}
            className={cn(
              "w-full group",
              "relative p-4 rounded-xl text-left",
              "transition-all duration-150",
              "active:scale-[0.98]",
              selected === value 
                ? `bg-${color}-500/20 ring-2 ring-${color}-500` 
                : 'bg-content/5 hover:bg-content/10',
              "outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            )}
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                "transition-colors duration-150",
                selected === value
                  ? `bg-${color}-500`
                  : `bg-${color}-500/10 group-hover:bg-${color}-500/20`
              )}>
                <Icon 
                  className={cn(
                    "transition-colors duration-150",
                    selected === value
                      ? "text-white"
                      : `text-${color}-500`
                  )}
                  size={20} 
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-medium truncate">{title}</h3>
                  <div className="flex gap-1 shrink-0">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className={cn(
                          "w-3 h-1 rounded-full",
                          "transition-colors duration-150",
                          i < intensity
                            ? selected === value 
                              ? `bg-${color}-500`
                              : `bg-${color}-500/40 group-hover:bg-${color}-500/60`
                            : 'bg-content/10'
                        )}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-foreground/60 truncate">{description}</p>
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

export default ActivityLevelStep;