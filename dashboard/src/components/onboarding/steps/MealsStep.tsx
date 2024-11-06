import { useState } from 'react';
import { Button, Chip } from "@nextui-org/react";
import { Coffee, Utensils, Cookie, ChefHat, Check, ArrowRight } from 'lucide-react';
import { cn } from '@/utils/cn';

interface MealsStepProps {
  onComplete: (value: number) => void;
  isLoading?: boolean;
}

const MealsStep = ({ onComplete, isLoading = false }: MealsStepProps) => {
  const [selected, setSelected] = useState<number | null>(null);
  const [error, setError] = useState('');

  const mealOptions = [
    {
      value: 3,
      title: '3 Meals',
      description: 'Traditional schedule',
      schedule: ['Breakfast', 'Lunch', 'Dinner'],
      color: 'primary',
      icon: Coffee,
      details: 'Best for busy schedules'
    },
    {
      value: 4,
      title: '4 Meals',
      description: 'With afternoon snack',
      schedule: ['Breakfast', 'Lunch', 'Snack', 'Dinner'],
      color: 'secondary',
      icon: Cookie,
      details: 'Balanced energy levels'
    },
    {
      value: 5,
      title: '5 Meals',
      description: 'Frequent small portions',
      schedule: ['Breakfast', 'Morning Snack', 'Lunch', 'Afternoon Snack', 'Dinner'],
      color: 'success',
      icon: Utensils,
      details: 'Optimal for muscle gain'
    },
    {
      value: 6,
      title: '6 Meals',
      description: 'Professional athlete plan',
      schedule: ['Early Breakfast', 'Late Breakfast', 'Lunch', 'Afternoon Snack', 'Dinner', 'Evening Snack'],
      color: 'warning',
      icon: ChefHat,
      details: 'Maximum nutrient timing'
    }
  ] as const;

  const handleSubmit = () => {
    if (!selected) {
      setError('Please select your preferred meal frequency');
      return;
    }
    onComplete(selected);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-3">
        {mealOptions.map(({ value, title, description, schedule, color, icon: Icon, details }) => (
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
            <div className="flex gap-4">
              {/* Icon */}
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
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* Title and Description */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="font-medium flex items-center gap-2">
                      {title}
                      {selected === value && (
                        <Check size={16} className={`text-${color}-500`} />
                      )}
                    </h3>
                    <p className="text-sm text-foreground/60">{description}</p>
                  </div>
                  <ArrowRight 
                    size={16} 
                    className={cn(
                      "opacity-0 transition-opacity duration-200",
                      selected === value && "opacity-100",
                      `text-${color}-500`
                    )}
                  />
                </div>

                {/* Meals Schedule */}
                <div className="flex flex-wrap gap-2">
                  {schedule.map((meal, index) => (
                    <Chip
                      key={meal}
                      size="sm"
                      className={cn(
                        "transition-colors duration-150",
                        selected === value
                          ? `bg-${color}-500/20 text-${color}-500`
                          : 'bg-content/10'
                      )}
                      startContent={
                        <span className="w-2 h-2 rounded-full bg-current opacity-70" />
                      }
                    >
                      {meal}
                    </Chip>
                  ))}
                </div>

                {/* Details */}
                {selected === value && (
                  <div className={cn(
                    "mt-3 p-2 rounded-lg text-sm",
                    `bg-${color}-500/10 text-${color}-500`
                  )}>
                    {details}
                  </div>
                )}
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

export default MealsStep;