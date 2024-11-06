// src/components/onboarding/steps/ActivityLevelStep.tsx
import { useState } from 'react';
import { Button } from "@nextui-org/react";
import { motion } from "framer-motion";
import { Armchair, Footprints, Rabbit, Dumbbell, Zap } from 'lucide-react';

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
  ];

  const handleSubmit = () => {
    if (!selected) {
      setError('Please select your activity level');
      return;
    }
    onComplete(selected);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {activityLevels.map(({ value, title, description, icon: Icon, color, intensity }) => (
          <motion.button
            key={value}
            onClick={() => {
              setSelected(value);
              setError('');
            }}
            className={`
              w-full relative p-4 rounded-xl text-left transition-all duration-300
              ${selected === value 
                ? `bg-${color}-500/20 border-2 border-${color}-500` 
                : 'bg-content/5 rounded-xl shadow-inner bg-white/5 backdrop-blur-md border-content/10 hover:border-content/20'
              }
            `}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-4">
              <div className={`
                w-12 h-12 rounded-lg 
                ${selected === value ? `bg-${color}-500` : `bg-${color}-500/10`}
                flex items-center justify-center
              `}>
                <Icon 
                  className={selected === value ? 'text-white' : `text-${color}-500`} 
                  size={24} 
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{title}</h3>
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className={`
                          w-4 h-1 rounded-full transition-colors
                          ${i < intensity 
                            ? selected === value 
                              ? `bg-${color}-500` 
                              : `bg-${color}-500/50`
                            : 'bg-content/10'
                          }
                        `}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-foreground/60">{description}</p>
              </div>
            </div>
          </motion.button>
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