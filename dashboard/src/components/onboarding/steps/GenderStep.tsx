// src/components/onboarding/steps/GenderStep.tsx
import { useState, useEffect } from 'react';
import { Card, CardBody } from "@nextui-org/react";
import { Info, PersonStanding, Triangle } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useStepValidation } from '@/hooks/useStepValidation';

interface GenderStepProps {
  onComplete: (value: string) => void;
  onValidationChange?: (isValid: boolean) => void;
  initialValue?: string;
}

const GenderStep = ({ onComplete, onValidationChange, initialValue }: GenderStepProps) => {
  const { selected, handleSelect } = useStepValidation<'Male' | 'Female'>(
    initialValue as 'Male' | 'Female',
    onComplete,
    onValidationChange
  );

  const genderOptions = [
    {
      value: 'Male' as const,
      icon: PersonStanding,
      color: 'primary',
      traits: ['Higher muscle mass', 'Faster metabolism']
    },
    {
      value: 'Female' as const,
      icon: Triangle,
      color: 'secondary',
      traits: ['Higher flexibility', 'Better endurance']
    }
  ] as const;

  return (
    <div className="space-y-4">
      {/* Gender Selection Cards - Side by side */}
      <div className="grid grid-cols-2 gap-4">
        {genderOptions.map(({ value, icon: Icon, color, traits }) => (
          <Card
            key={value}
            isPressable
            isHoverable
            onPress={() => handleSelect(value)}
            className={cn(
              "border-2 transition-all duration-200",
              selected === value
                ? `border-${color}-500 bg-${color}-500/5`
                : "border-transparent"
            )}
          >
            <CardBody className="p-4">
              <div className="flex flex-col items-center">
                {/* Icon and Label */}
                <div className={cn(
                  "w-12 h-12 rounded-full mb-2",
                  "transition-colors duration-200",
                  "flex items-center justify-center",
                  selected === value
                    ? `bg-${color}-500`
                    : `bg-${color}-500/10`
                )}>
                  <Icon 
                    className={selected === value ? 'text-white' : `text-${color}-500`} 
                    size={24} 
                  />
                </div>
                <h3 className="text-base font-medium mb-2">{value}</h3>

                {/* Traits - More compact */}
                <div className="w-full space-y-1">
                  {traits.map((trait, index) => (
                    <div 
                      key={index}
                      className={cn(
                        "text-xs text-center py-1 px-2 rounded",
                        selected === value
                          ? `bg-${color}-500/10 text-${color}-500`
                          : "bg-content1"
                      )}
                    >
                      {trait}
                    </div>
                  ))}
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
              Your sex assists me in calculating your BMR for accurate meal planning.
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default GenderStep;