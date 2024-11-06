// src/components/onboarding/steps/GoalStep.tsx
import { useState } from 'react';
import { Button } from "@nextui-org/react";
import { motion } from "framer-motion";
import { Scale, Dumbbell, Target, Shield } from 'lucide-react';

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
    },
    {
      id: 'Weight Gain',
      title: 'Weight Gain',
      description: 'Build mass and increase body weight',
      icon: Target,
      color: 'secondary',
    },
    {
      id: 'Muscle Building',
      title: 'Muscle Building',
      description: 'Focus on strength and muscle development',
      icon: Dumbbell,
      color: 'success',
    },
    {
      id: 'Maintenance',
      title: 'Maintenance',
      description: 'Maintain current weight and improve fitness',
      icon: Shield,
      color: 'warning',
    },
  ];

  const handleSubmit = () => {
    if (!selected) {
      setError('Please select your goal');
      return;
    }
    onComplete(selected);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {goals.map(({ id, title, description, icon: Icon, color }) => (
          <motion.button
            key={id}
            onClick={() => {
              setSelected(id);
              setError('');
            }}
            className={`
              relative p-4 rounded-xl text-left transition-all duration-150
              ${selected === id 
                ? `bg-${color}-500/20 border-2 border-${color}-500` 
                : 'bg-content/5 rounded-xl shadow-inner bg-white/5 backdrop-blur-md border-content/10 hover:border-content/20'
              }
            `}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="space-y-3">
              <div className={`
                w-10 h-10 rounded-lg 
                ${selected === id ? `bg-${color}-500` : `bg-${color}-500/10`}
                flex items-center justify-center
              `}>
                <Icon 
                  className={selected === id ? 'text-white' : `text-${color}-500`} 
                  size={20} 
                />
              </div>
              <div>
                <h3 className="font-medium">{title}</h3>
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

export default GoalStep;