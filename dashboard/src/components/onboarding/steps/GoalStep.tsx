import { useState, useEffect } from 'react';
import { Card, CardBody } from "@nextui-org/react";
import { Scale, Dumbbell, Target, Shield, Info, Check } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useStepValidation } from '@/hooks/useStepValidation';

interface GoalStepProps {
  onComplete: (goal: string) => void;
  onValidationChange?: (isValid: boolean) => void;
  initialValue?: string;
}

export type FitnessGoal = 'Weight Loss' | 'Weight Gain' | 'Muscle Building' | 'Maintenance';

const goals = [
  {
    id: 'Weight Loss' as const,
    title: 'Weight Loss',
    description: 'Reduce body fat and improve overall fitness',
    icon: Scale,
    color: 'primary',
    features: [
      { text: 'Fat loss through caloric deficit', icon: '🔥' },
      { text: 'Cardio-focused training', icon: '🏃' },
      { text: 'Nutrition planning', icon: '🥗' }
    ]
  },
  {
    id: 'Weight Gain' as const,
    title: 'Weight Gain',
    description: 'Build mass and increase body weight',
    icon: Target,
    color: 'secondary',
    features: [
      { text: 'Mass gain through surplus', icon: '📈' },
      { text: 'Strength-focused training', icon: '💪' },
      { text: 'High-protein diet', icon: '🥩' }
    ]
  },
  {
    id: 'Muscle Building' as const,
    title: 'Muscle Building',
    description: 'Focus on strength and muscle development',
    icon: Dumbbell,
    color: 'success',
    features: [
      { text: 'Muscle hypertrophy', icon: '🏋️' },
      { text: 'Progressive overload', icon: '📊' },
      { text: 'Body recomposition', icon: '⚖️' }
    ]
  },
  {
    id: 'Maintenance' as const,
    title: 'Maintenance',
    description: 'Maintain current weight and improve fitness',
    icon: Shield,
    color: 'warning',
    features: [
      { text: 'Overall fitness balance', icon: '⚡' },
      { text: 'Performance focus', icon: '🎯' },
      { text: 'Healthy lifestyle', icon: '🌟' }
    ]
  },
] as const;

const GoalStep = ({ onComplete, onValidationChange, initialValue }: GoalStepProps) => {
  const { selected, handleSelect } = useStepValidation<FitnessGoal>(
    initialValue as FitnessGoal,
    onComplete,
    onValidationChange
  );

  return (
    <div className="space-y-6">
      {/* Goals Grid */}
      <div className="grid grid-cols-1 gap-4">
        {goals.map(({ id, title, description, icon: Icon, color, features }) => (
          <button
            key={id}
            onClick={() => handleSelect(id)}
            className="w-full text-left focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-xl"
          >
            <Card
              className={cn(
                "w-full transition-all",
                selected === id 
                  ? `border-2 border-${color}-500 bg-gradient-to-r from-${color}-500/10 to-background`
                  : "border border-divider hover:border-foreground/20"
              )}
            >
              <CardBody className="p-6">
                <div className="space-y-4">
                  {/* Header Section */}
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                      selected === id
                        ? `bg-${color}-500`
                        : `bg-${color}-500/10`
                    )}>
                      <Icon 
                        className={selected === id ? "text-white" : `text-${color}-500`}
                        size={24}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className={cn(
                          "text-lg font-semibold",
                          selected === id && `text-${color}-500`
                        )}>
                          {title}
                        </h3>
                        {selected === id && (
                          <Check className={`w-5 h-5 text-${color}-500`} />
                        )}
                      </div>
                      <p className="text-sm text-foreground/60 mt-0.5">
                        {description}
                      </p>
                    </div>
                  </div>

                  {/* Features Grid */}
                  <div className="grid grid-cols-1 gap-2">
                    {features.map(({ text, icon }) => (
                      <div 
                        key={text}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-lg",
                          selected === id
                            ? `bg-${color}-500/10`
                            : "bg-content1"
                        )}
                      >
                        <span className="text-xl">{icon}</span>
                        <span className={cn(
                          "text-sm",
                          selected === id
                            ? `text-${color}-500`
                            : "text-foreground/80"
                        )}>
                          {text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardBody>
            </Card>
          </button>
        ))}
        <Card className="bg-content2">
          <CardBody className="p-3">
            <div className="flex gap-2">
              <Info className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-foreground/70">
              Your goal helps me create a personalized program with the right balance of exercises 
              and nutrition recommendations for optimal results.              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default GoalStep;