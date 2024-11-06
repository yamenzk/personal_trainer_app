// src/components/onboarding/steps/GenderStep.tsx
import { useState } from 'react';
import { Button } from "@nextui-org/react";
import { motion } from "framer-motion";
import { PersonStanding, Triangle, AlertCircle } from 'lucide-react';
import type { GenderStepProps } from '@/types/onboarding';

const GenderStep = ({ onComplete, isLoading = false }: GenderStepProps) => {
  const [selected, setSelected] = useState<'Male' | 'Female' | null>(null);
  const [error, setError] = useState('');

  const handleSelect = (value: 'Male' | 'Female') => {
    setSelected(value);
    setError('');
  };

  const genderOptions = [
    {
      value: 'Male' as const,
      icon: PersonStanding,
      color: 'primary',
      metrics: [
        { label: 'Recovery Time', value: '24-48 hours' },
      ]
    },
    {
      value: 'Female' as const,
      icon: Triangle,
      color: 'secondary',
      metrics: [
        { label: 'Recovery Time', value: '24-36 hours' },
      ]
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
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-6">
        {genderOptions.map(({ value, icon: Icon, color, metrics }) => (
          <motion.button
            key={value}
            onClick={() => handleSelect(value)}
            className={`
              relative p-6 rounded-xl text-center transition-all duration-300
              ${selected === value 
                ? `bg-${color}-500/20 border-2 border-${color}-500` 
                : 'bg-content/5 border border-content/10 hover:border-content/20'
              }
            `}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div className={`
                w-16 h-16 rounded-full
                ${selected === value ? `bg-${color}-500` : `bg-${color}-500/10`}
                flex items-center justify-center
              `}>
                <Icon 
                  className={selected === value ? 'text-white' : `text-${color}-500`} 
                  size={32} 
                />
              </div>
            </div>

            {/* Label */}
            <h3 className="text-lg font-medium mb-4">{value}</h3>

            {/* Metrics */}
            <div className="space-y-2">
              {metrics.map(({ label, value: metricValue }) => (
                <div key={label} className="text-sm">
                  <p className="text-foreground/60">{label}</p>
                  <p className="font-medium">{metricValue}</p>
                </div>
              ))}
            </div>
          </motion.button>
        ))}
      </div>

      {/* Info Box */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-primary-500/5">
        <AlertCircle className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
        <div className="space-y-2">
          <p className="text-sm text-foreground/70">
            Your sex helps me calculate your nutritional needs and customize your training program based on physiological differences.
          </p>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 rounded-lg bg-content/5 text-xs">
              <span className="font-medium">Metabolism:</span> Different caloric needs
            </div>
            <div className="p-2 rounded-lg bg-content/5 text-xs">
              <span className="font-medium">Hormones:</span> Different recovery patterns
            </div>
            <div className="p-2 rounded-lg bg-content/5 text-xs">
              <span className="font-medium">Strength:</span> Different muscle development
            </div>
            <div className="p-2 rounded-lg bg-content/5 text-xs">
              <span className="font-medium">Body Comp:</span> Different fat distribution
            </div>
          </div>
        </div>
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