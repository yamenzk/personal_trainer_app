import { Card, CardBody } from "@nextui-org/react";
import { Info, PersonStanding } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useStepValidation } from '@/hooks/useStepValidation';
import { GenderStepProps } from '@/types';

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
      traits: [
        { label: 'Muscle Mass', value: 'Higher' },
        { label: 'Metabolism', value: 'Faster' },
        { label: 'Recovery', value: 'Moderate' }
      ]
    },
    {
      value: 'Female' as const,
      icon: PersonStanding,
      color: 'secondary',
      traits: [
        { label: 'Flexibility', value: 'Higher' },
        { label: 'Endurance', value: 'Better' },
        { label: 'Recovery', value: 'Faster' }
      ]
    }
  ] as const;

  return (
    <div className="space-y-6">
      {/* Gender Selection Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {genderOptions.map(({ value, icon: Icon, color, traits }) => (
          <button
            key={value}
            onClick={() => handleSelect(value)}
            className="w-full text-left focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-xl"
          >
            <Card
              className={cn(
                "w-full transition-colors",
                selected === value 
                  ? `border-2 border-${color}-500 bg-gradient-to-b from-${color}-500/10 to-background` 
                  : "border border-divider hover:border-foreground/20"
              )}
            >
              <CardBody className="p-6">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center",
                      selected === value 
                        ? `bg-${color}-500` 
                        : `bg-${color}-500/10`
                    )}>
                      <Icon 
                        className={cn(
                          "w-6 h-6",
                          selected === value 
                            ? "text-white" 
                            : `text-${color}-500`
                        )} 
                      />
                    </div>
                    <div>
                      <h3 className={cn(
                        "text-lg font-semibold",
                        selected === value && `text-${color}-500`
                      )}>
                        {value}
                      </h3>
                    </div>
                  </div>

                  {/* Traits */}
                  <div className="space-y-2">
                    {traits.map(({ label, value: traitValue }, index) => (
                      <div 
                        key={index}
                        className={cn(
                          "flex justify-between items-center p-2 rounded-lg",
                          selected === value 
                            ? `bg-${color}-500/10` 
                            : "bg-content1"
                        )}
                      >
                        <span className="text-sm text-foreground/60">{label}</span>
                        <span className={cn(
                          "text-sm font-medium",
                          selected === value && `text-${color}-500`
                        )}>
                          {traitValue}
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
            Your sex helps me calculate your Basal Metabolic Rate (BMR) accurately, enabling me to create a personalized meal plan that matches your body's needs.
            </p>
          </div>
        </CardBody>
      </Card>
      </div>
    </div>
  );
};

export default GenderStep;