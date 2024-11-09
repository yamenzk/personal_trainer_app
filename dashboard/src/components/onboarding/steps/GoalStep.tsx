// src/components/onboarding/steps/GoalStep.tsx
import { useState, useEffect } from 'react';
import { Card, CardBody } from "@nextui-org/react";
import { Scale, Dumbbell, Target, Shield, BadgeCheck } from 'lucide-react';
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
    <div className="space-y-3">
      {goals.map(({ id, title, description, icon: Icon, color, features }) => (
        <Card
          key={id}
          isPressable
          isHoverable
          onPress={() => handleSelect(id)}
          className={cn(
            "w-full border-2 transition-all duration-200",
            selected === id 
              ? `border-${color}-500 bg-${color}-500/5`
              : "border-transparent hover:bg-content1"
          )}
        >
          <CardBody className="p-4">
            <div className="flex gap-4">
              {/* Icon Column */}
              <div className={cn(
                "w-12 h-12 rounded-lg flex items-center justify-center shrink-0",
                "transition-colors duration-200",
                selected === id
                  ? `bg-${color}-500`
                  : `bg-${color}-500/10`
              )}>
                <Icon 
                  className={selected === id ? "text-white" : `text-${color}-500`}
                  size={24}
                />
              </div>

              {/* Content Column */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-medium">{title}</h3>
                      {selected === id && (
                        <BadgeCheck className={`w-4 h-4 text-${color}-500`} />
                      )}
                    </div>
                    <p className="text-sm text-foreground/60 mb-3">{description}</p>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-1.5">
                  {features.map(({ text, icon }) => (
                    <div 
                      key={text}
                      className={cn(
                        "flex items-center gap-2 text-sm px-2 py-1 rounded",
                        selected === id
                          ? `bg-${color}-500/10`
                          : "bg-content2/20"
                      )}
                    >
                      <span className="text-base">{icon}</span>
                      <span className="text-foreground/80">{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      ))}

      {/* Help Text */}
      <Card className="bg-content2">
        <CardBody className="p-3">
          <div className="flex gap-2">
            <Target className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-foreground/70">
              Your goal helps me create a personalized program that focuses on the right balance 
              of exercise types and nutrition recommendations for optimal results.
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default GoalStep;
