// src/components/onboarding/steps/ActivityLevelStep.tsx
import { useState, useEffect } from 'react';
import { Card, CardBody } from "@nextui-org/react";
import { Armchair, Footprints, Rabbit, Dumbbell, Zap, Activity } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useStepValidation } from '@/hooks/useStepValidation';

interface ActivityLevelStepProps {
  onComplete: (value: string) => void;
  onValidationChange?: (isValid: boolean) => void;
  initialValue?: string;
}

type ActivityLevel = 'Sedentary' | 'Light' | 'Moderate' | 'Very Active' | 'Extra Active';

const activityLevels = [
  {
    value: 'Sedentary' as ActivityLevel,
    title: 'Sedentary',
    description: 'Little to no exercise, desk job',
    details: 'Daily activities only, mostly sitting',
    icon: Armchair,
    color: 'neutral', // changed from 'default'
    intensity: 1,
    calories: '× 1.2 BMR'
  },
  {
    value: 'Light' as ActivityLevel,
    title: 'Lightly Active',
    description: 'Light exercise 1-3 days/week',
    details: 'Walking, light stretching, casual sports',
    icon: Footprints,
    color: 'primary',
    intensity: 2,
    calories: '× 1.375 BMR'
  },
  {
    value: 'Moderate' as ActivityLevel,
    title: 'Moderately Active',
    description: 'Moderate exercise 3-5 days/week',
    details: 'Jogging, recreational sports, regular workouts',
    icon: Rabbit,
    color: 'secondary',
    intensity: 3,
    calories: '× 1.55 BMR'
  },
  {
    value: 'Very Active' as ActivityLevel,
    title: 'Very Active',
    description: 'Hard exercise 6-7 days/week',
    details: 'Intense training, competitive sports',
    icon: Dumbbell,
    color: 'success',
    intensity: 4,
    calories: '× 1.725 BMR'
  },
  {
    value: 'Extra Active' as ActivityLevel,
    title: 'Extra Active',
    description: 'Very hard exercise & physical job',
    details: 'Professional athlete or extremely active lifestyle',
    icon: Zap,
    color: 'warning',
    intensity: 5,
    calories: '× 1.9 BMR'
  },
] as const;

const ActivityLevelStep = ({ onComplete, onValidationChange, initialValue }: ActivityLevelStepProps) => {
  const { selected, handleSelect } = useStepValidation<ActivityLevel>(initialValue as ActivityLevel, onComplete, onValidationChange);

  return (
    <div className="space-y-6">
      {/* Activity Levels */}
      <div className="space-y-3">
        {activityLevels.map(({ value, title, description, details, icon: Icon, color, intensity, calories }) => (
          <Card
            key={value}
            isPressable
            isHoverable
            onPress={() => handleSelect(value)}
            className={cn(
              "w-full border-2 transition-all duration-200",
              selected === value 
                ? color === 'neutral'
                  ? "border-foreground/50 bg-foreground/5"
                  : `border-${color}-500 bg-${color}-500/5`
                : "border-transparent hover:bg-content1"
            )}
          >
            <CardBody className="p-4">
              <div className="flex gap-4">
                {/* Icon */}
                <div className={cn(
                  "w-12 h-12 rounded-lg flex items-center justify-center shrink-0",
                  "transition-colors duration-200",
                  selected === value
                    ? color === 'neutral'
                      ? "bg-foreground/50"
                      : `bg-${color}-500`
                    : color === 'neutral'
                      ? "bg-foreground/10"
                      : `bg-${color}-500/10`
                )}>
                  <Icon 
                    className={cn(
                      selected === value 
                        ? "text-white" 
                        : color === 'neutral'
                          ? "text-foreground/90"
                          : `text-${color}-500`
                    )}
                    size={24}
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-base font-medium">{title}</h3>
                      <p className="text-sm text-foreground/60">{description}</p>
                    </div>
                    
                    {/* Intensity Indicators */}
                    <div className="flex gap-1 pt-1.5 absolute top-2 right-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div
                          key={i}
                          className={cn(
                            "w-4 h-1.5 rounded-full transition-colors duration-200",
                            i < intensity
                              ? selected === value 
                                ? color === 'neutral'
                                  ? "bg-foreground/90"
                                  : `bg-${color}-500`
                                : color === 'neutral'
                                  ? "bg-transparent"
                                  : `bg-${color}-500/40`
                              : 'bg-transparent'
                          )}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Additional Details */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    <div className={cn(
                      "text-xs py-1 rounded"
                    )}>
                      {details}
                    </div>
                    {/* <div className={cn(
                      "text-xs px-2 py-1 rounded flex items-center gap-1",
                      selected === value
                        ? color === 'neutral'
                          ? "bg-foreground/10 text-foreground/90"
                          : `bg-${color}-500/10 text-${color}-600`
                        : "bg-content2/40"
                    )}>
                      <Activity className="w-3 h-3" />
                      {calories}
                    </div> */}
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Help Text */}
      <Card className="bg-content2">
        <CardBody className="p-3">
          <div className="flex gap-2">
            <Activity className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-foreground/70">
              Your activity level helps me calculate your daily calorie needs and adjust your 
              fitness program intensity. Choose the option that best matches your typical week.
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default ActivityLevelStep;