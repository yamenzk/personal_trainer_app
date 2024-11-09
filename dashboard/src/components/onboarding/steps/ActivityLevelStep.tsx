import { useState, useEffect } from 'react';
import { Card, CardBody } from "@nextui-org/react";
import { Armchair, Footprints, Rabbit, Dumbbell, Zap, Info, Check, Activity } from 'lucide-react';
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
    description: 'Little to no exercise',
    details: [
      'Desk job',
      'Limited movement',
      'Basic daily activities'
    ],
    icon: Armchair,
    color: 'primary',
    intensity: 1,
  },
  {
    value: 'Light' as ActivityLevel,
    title: 'Lightly Active',
    description: 'Light exercise 1-3 days/week',
    details: [
      'Regular walking',
      'Light stretching',
      'Casual activities'
    ],
    icon: Footprints,
    color: 'secondary',
    intensity: 2,
  },
  {
    value: 'Moderate' as ActivityLevel,
    title: 'Moderately Active',
    description: 'Moderate exercise 3-5 days/week',
    details: [
      'Regular workouts',
      'Active lifestyle',
      'Recreational sports'
    ],
    icon: Rabbit,
    color: 'success',
    intensity: 3,
  },
  {
    value: 'Very Active' as ActivityLevel,
    title: 'Very Active',
    description: 'Hard exercise 6-7 days/week',
    details: [
      'Intense training',
      'Competitive sports',
      'Regular exercise'
    ],
    icon: Dumbbell,
    color: 'warning',
    intensity: 4,
  },
  {
    value: 'Extra Active' as ActivityLevel,
    title: 'Extra Active',
    description: 'Very hard exercise & physical job',
    details: [
      'Professional athlete',
      'Physical labor',
      'Multiple trainings'
    ],
    icon: Zap,
    color: 'danger',
    intensity: 5,
  },
] as const;

const ActivityLevelStep = ({ onComplete, onValidationChange, initialValue }: ActivityLevelStepProps) => {
  const { selected, handleSelect } = useStepValidation<ActivityLevel>(
    initialValue as ActivityLevel, 
    onComplete, 
    onValidationChange
  );

  return (
    <div className="space-y-4">

      {/* Activity Levels */}
      <div className="grid grid-cols-1 gap-3">
        {activityLevels.map(({ value, title, description, details, icon: Icon, color, intensity }) => (
          <button
            key={value}
            onClick={() => handleSelect(value)}
            className="w-full text-left focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg"
          >
            <Card
              className={cn(
                "w-full transition-all",
                selected === value 
                  ? `border-2 border-${color}-500 bg-gradient-to-r from-${color}-500/10 to-background`
                  : "border border-divider hover:border-foreground/20"
              )}
            >
              <CardBody className="p-4">
                <div className="relative">
                  {/* Intensity Indicator - Absolute Position */}
                  <div className="absolute top-0 right-0 flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className={cn(
                          "w-4 h-1 rounded-full transition-colors",
                          i < intensity
                            ? selected === value 
                              ? `bg-${color}-500`
                              : `bg-${color}-500/40`
                            : "bg-foreground/0"
                        )}
                      />
                    ))}
                  </div>

                  <div className="flex gap-3">
                    {/* Icon */}
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                      selected === value
                        ? `bg-${color}-500`
                        : `bg-${color}-500/10`
                    )}>
                      <Icon 
                        className={selected === value ? "text-white" : `text-${color}-500`}
                        size={20}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={cn(
                          "text-base font-semibold",
                          selected === value && `text-${color}-500`
                        )}>
                          {title}
                        </h3>
                        {selected === value && (
                          <Check className={`w-4 h-4 text-${color}-500`} />
                        )}
                      </div>
                      <p className="text-sm text-foreground/60">
                        {description}
                      </p>

                      {/* Details */}
                      <div className="flex flex-wrap gap-2 mt-2">
                        {details.map((detail, index) => (
                          <div 
                            key={index}
                            className={cn(
                              "text-xs px-2 py-1 rounded-md",
                              selected === value
                                ? `bg-${color}-500/10 text-${color}-500`
                                : "bg-content1 text-foreground/70"
                            )}
                          >
                            {detail}
                          </div>
                        ))}
                      </div>
                    </div>
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
            Your activity level helps me calculate your daily calorie needs and customize your program intensity.
            </p>
          </div>
        </CardBody>
      </Card>
      </div>
    </div>
  );
};

export default ActivityLevelStep;