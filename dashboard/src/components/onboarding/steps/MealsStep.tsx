// src/components/onboarding/steps/MealsStep.tsx
import { useState, useEffect } from 'react';
import { Card, CardBody, Chip } from "@nextui-org/react";
import { Coffee, Utensils, Cookie, ChefHat, Timer, Check, Info } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useStepValidation } from '@/hooks/useStepValidation';

interface MealsStepProps {
  onComplete: (value: number) => void;
  onValidationChange?: (isValid: boolean) => void;
  initialValue?: number;
}

const mealOptions = [
  {
    value: 3,
    title: '3 Meals',
    description: 'Traditional schedule',
    icon: Coffee,
    color: 'primary',
    schedule: [
      { time: 'Morning', meal: 'Breakfast' },
      { time: 'Afternoon', meal: 'Lunch' },
      { time: 'Evening', meal: 'Dinner' }
    ],
    benefits: [
      'Easier to maintain',
      'Simple meal prep',
      'Traditional timing'
    ],
    idealFor: 'Best for busy schedules and traditional lifestyles'
  },
  {
    value: 4,
    title: '4 Meals',
    description: 'With afternoon snack',
    icon: Cookie,
    color: 'secondary',
    schedule: [
      { time: 'Morning', meal: 'Breakfast' },
      { time: 'Noon', meal: 'Lunch' },
      { time: '3-4 PM', meal: 'Snack' },
      { time: 'Evening', meal: 'Dinner' }
    ],
    benefits: [
      'Stable energy levels',
      'Reduced hunger',
      'Better portion control'
    ],
    idealFor: 'Perfect for weight management and steady energy throughout the day'
  },
  {
    value: 5,
    title: '5 Meals',
    description: 'Frequent small portions',
    icon: Utensils,
    color: 'success',
    schedule: [
      { time: 'Early Morning', meal: 'Breakfast' },
      { time: 'Mid-Morning', meal: 'Snack' },
      { time: 'Afternoon', meal: 'Lunch' },
      { time: 'Mid-Afternoon', meal: 'Snack' },
      { time: 'Evening', meal: 'Dinner' }
    ],
    benefits: [
      'Enhanced metabolism',
      'Better nutrient absorption',
      'Increased muscle gains'
    ],
    idealFor: 'Optimal for muscle building and active lifestyles'
  },
  {
    value: 6,
    title: '6 Meals',
    description: 'Professional athlete plan',
    icon: ChefHat,
    color: 'warning',
    schedule: [
      { time: '7 AM', meal: 'Early Breakfast' },
      { time: '10 AM', meal: 'Late Breakfast' },
      { time: '1 PM', meal: 'Lunch' },
      { time: '4 PM', meal: 'Afternoon Snack' },
      { time: '7 PM', meal: 'Dinner' },
      { time: '9 PM', meal: 'Evening Snack' }
    ],
    benefits: [
      'Maximum nutrient timing',
      'Optimal protein synthesis',
      'Enhanced recovery'
    ],
    idealFor: 'Designed for athletes and intensive training programs'
  }
] as const;

const MealsStep = ({ onComplete, onValidationChange, initialValue }: MealsStepProps) => {
  const { selected, handleSelect } = useStepValidation(initialValue, onComplete, onValidationChange);

  return (
    <div className="space-y-6">
      {/* Meal Options */}
      <div className="grid gap-4">
        {mealOptions.map(({ value, title, description, icon: Icon, color, schedule, benefits, idealFor }) => (
          <Card
            key={value}
            isPressable
            isHoverable
            onPress={() => handleSelect(value)}
            className={cn(
              "w-full border-2 transition-all duration-200",
              selected === value 
                ? `border-${color}-500 bg-${color}-500/5`
                : "border-transparent hover:bg-content1"
            )}
          >
            <CardBody className="p-4">
              {/* Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className={cn(
                  "w-12 h-12 rounded-lg flex items-center justify-center shrink-0",
                  "transition-colors duration-200",
                  selected === value
                    ? `bg-${color}-500`
                    : `bg-${color}-500/10`
                )}>
                  <Icon 
                    className={selected === value ? "text-white" : `text-${color}-500`}
                    size={24}
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium flex items-center gap-2">
                        {title}
                        {selected === value && (
                          <Check className={`w-4 h-4 text-${color}-500`} />
                        )}
                      </h3>
                      <p className="text-sm text-foreground/60">{description}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Schedule */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Timer className={`w-4 h-4 text-${color}-500`} />
                  <p className="text-sm font-medium">Daily Schedule</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {schedule.map(({ time, meal }) => (
                    <div
                      key={`${time}-${meal}`}
                      className={cn(
                        "flex items-center gap-2 p-2 rounded-lg text-sm",
                        selected === value
                          ? `bg-${color}-500/10`
                          : "bg-content2/20"
                      )}
                    >
                      <span className={`text-${color}-500 font-medium text-xs`}>{time}</span>
                      <span className="text-foreground/60 text-xs">{meal}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Benefits */}
              <div className="space-y-2">
                <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                  {benefits.map((benefit) => (
                    <Chip
                      key={benefit}
                      size="sm"
                      variant="bordered"
                      color={color}
                      className={selected === value ? 'opacity-100' : 'opacity-70'}
                    >
                      {benefit}
                    </Chip>
                  ))}
                </div>

                <div className={cn(
                  "flex items-start gap-2 p-2 rounded-lg text-sm",
                )}>
                  <Info className={`w-4 h-4 text-${color}-500 flex-shrink-0 mt-0.5`} />
                  <p className="text-foreground/60">{idealFor}</p>
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
            <Info className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-foreground/70">
              Choose a meal frequency that fits your lifestyle and schedule. You can always 
              adjust this later as your routine changes. I'll help you plan portions and 
              timing for optimal results.
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default MealsStep;