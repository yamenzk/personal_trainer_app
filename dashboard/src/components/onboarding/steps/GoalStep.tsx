import { useState } from 'react';
import { Button, Chip } from "@nextui-org/react";
import { Scale, Dumbbell, Target, Shield, ArrowRight, Check } from 'lucide-react';
import { cn } from '@/utils/cn';

interface GoalStepProps {
  onComplete: (goal: string) => void;
  isLoading?: boolean;
}

const GoalStep = ({ onComplete, isLoading = false }: GoalStepProps) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [error, setError] = useState('');

  const goals = [
    {
      id: 'Weight Loss',
      title: 'Weight Loss',
      description: 'Reduce body fat and improve overall fitness',
      icon: Scale,
      color: 'primary',
      features: ['Fat loss', 'Cardio focus', 'Caloric deficit']
    },
    {
      id: 'Weight Gain',
      title: 'Weight Gain',
      description: 'Build mass and increase body weight',
      icon: Target,
      color: 'secondary',
      features: ['Mass gain', 'Strength focus', 'Caloric surplus']
    },
    {
      id: 'Muscle Building',
      title: 'Muscle Building',
      description: 'Focus on strength and muscle development',
      icon: Dumbbell,
      color: 'success',
      features: ['Hypertrophy', 'Progressive overload', 'Body recomposition']
    },
    {
      id: 'Maintenance',
      title: 'Maintenance',
      description: 'Maintain current weight and improve fitness',
      icon: Shield,
      color: 'warning',
      features: ['Balance', 'Overall fitness', 'Body maintenance']
    },
  ] as const;

  const handleSubmit = () => {
    if (!selected) {
      setError('Please select your goal');
      return;
    }
    onComplete(selected);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-3">
        {goals.map(({ id, title, description, icon: Icon, color, features }) => (
          <button
            key={id}
            onClick={() => {
              setSelected(id);
              setError('');
            }}
            className={cn(
              "w-full text-left",
              "p-4 rounded-xl",
              "transition-all duration-150",
              "active:scale-[0.98]",
              "outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
              selected === id 
                ? `bg-${color}-500/20 ring-2 ring-${color}-500` 
                : 'bg-content/5 hover:bg-content/10'
            )}
          >
            <div className="flex gap-3">
              {/* Icon */}
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                "transition-colors duration-150",
                selected === id
                  ? `bg-${color}-500`
                  : `bg-${color}-500/10 group-hover:bg-${color}-500/20`
              )}>
                <Icon 
                  className={cn(
                    "transition-colors duration-150",
                    selected === id
                      ? "text-white"
                      : `text-${color}-500`
                  )}
                  size={20} 
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-medium flex items-center gap-2">
                      {title}
                      {selected === id && (
                        <Check size={16} className={`text-${color}-500`} />
                      )}
                    </h3>
                    <p className="text-sm text-foreground/60">{description}</p>
                  </div>
                  <ArrowRight 
                    size={16} 
                    className={cn(
                      "opacity-0 transition-opacity duration-200",
                      selected === id && "opacity-100",
                      `text-${color}-500`
                    )}
                  />
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {features.map((feature) => (
                    <Chip
                      key={feature}
                      size="sm"
                      className={cn(
                        "transition-colors duration-150",
                        selected === id
                          ? `bg-${color}-500/20 text-${color}-500`
                          : 'bg-content/10'
                      )}
                    >
                      {feature}
                    </Chip>
                  ))}
                </div>
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

export default GoalStep;