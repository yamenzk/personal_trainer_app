import { useState } from 'react';
import { Button, Chip } from "@nextui-org/react";
import { PersonStanding, Triangle, AlertCircle, Check } from 'lucide-react';
import type { GenderStepProps } from '@/types/onboarding';
import { cn } from '@/utils/cn';

const GenderStep = ({ onComplete, isLoading = false }: GenderStepProps) => {
  const [selected, setSelected] = useState<'Male' | 'Female' | null>(null);
  const [error, setError] = useState('');

  const genderOptions = [
    {
      value: 'Male' as const,
      icon: PersonStanding,
      color: 'primary',
      aspects: ['Higher muscle mass', 'Faster metabolism', 'Longer recovery time']
    },
    {
      value: 'Female' as const,
      icon: Triangle,
      color: 'secondary',
      aspects: ['Higher flexibility', 'Efficient fat burning', 'Better endurance']
    }
  ] as const;

  const handleSubmit = () => {
    if (!selected) {
      setError('Please select your gender');
      return;
    }
    onComplete(selected);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {genderOptions.map(({ value, icon: Icon, color, aspects }) => (
          <button
            key={value}
            onClick={() => {
              setSelected(value);
              setError('');
            }}
            className={cn(
              "relative p-4 rounded-xl text-center",
              "transition-all duration-150",
              "active:scale-[0.98]",
              "outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
              selected === value 
                ? `bg-${color}-500/20 ring-2 ring-${color}-500` 
                : 'bg-content/5 hover:bg-content/10'
            )}
          >
            {/* Selected indicator */}
            {selected === value && (
              <div className="absolute top-2 right-2">
                <div className={`w-5 h-5 rounded-full bg-${color}-500 flex items-center justify-center`}>
                  <Check size={12} className="text-white" />
                </div>
              </div>
            )}

            {/* Icon */}
            <div className={cn(
              "w-16 h-16 rounded-full mx-auto mb-3",
              "transition-colors duration-150",
              "flex items-center justify-center",
              selected === value
                ? `bg-${color}-500`
                : `bg-${color}-500/10`
            )}>
              <Icon 
                className={selected === value ? 'text-white' : `text-${color}-500`} 
                size={28} 
              />
            </div>

            {/* Content */}
            <h3 className="text-lg font-medium mb-3">{value}</h3>

            <div className="flex flex-col gap-2">
              {aspects.map((aspect, index) => (
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
                  {aspect}
                </Chip>
              ))}
            </div>
          </button>
        ))}
      </div>

      {/* Compact Info Box */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary-500/5">
        <AlertCircle size={16} className="text-primary-500 shrink-0" />
        <p className="text-xs text-foreground/70">
          Your sex helps calculate nutritional needs and customize training based on physiological differences
        </p>
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

export default GenderStep;