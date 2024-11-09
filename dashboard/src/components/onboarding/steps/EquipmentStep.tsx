// src/components/onboarding/steps/EquipmentStep.tsx
import { useState, useEffect } from 'react';
import { Card, CardBody, Chip } from "@nextui-org/react";
import { 
  Dumbbell, 
  Building2, 
  Home, 
  Clock, 
  Ruler, 
  CircleDollarSign,
  Trophy,
  AlertCircle,
  Check,
  Sparkles
} from 'lucide-react';
import { cn } from '@/utils/cn';

interface EquipmentStepProps {
  onComplete: (value: WorkoutLocation) => void;
  onValidationChange?: (isValid: boolean) => void;
  initialValue?: WorkoutLocation;
}

type WorkoutLocation = 'Gym' | 'Home';

const equipmentOptions = [
  {
    value: 'Gym' as const,
    title: 'Gym Access',
    description: 'Full equipment availability',
    icon: Building2,
    color: 'primary',
    features: [
      { icon: Dumbbell, text: 'Professional equipment', detail: 'Access to a wide range of machines and weights' },
      { icon: Clock, text: 'Flexible workout times', detail: 'Train any time during gym hours' },
      { icon: Trophy, text: 'Maximum variety', detail: 'Multiple exercise options for each muscle group' }
    ],
    equipment: {
      essential: [
        'Weight machines',
        'Free weights',
        'Cardio equipment'
      ],
      available: [
        'Resistance bands',
        'Cable machines',
        'Smith machines',
        'Benches & racks',
        'Functional area',
        'Stretching zone'
      ]
    }
  },
  {
    value: 'Home' as const,
    title: 'Home Workouts',
    description: 'Minimal equipment needed',
    icon: Home,
    color: 'secondary',
    features: [
      { icon: Clock, text: 'Time-efficient', detail: 'No commute time, workout on your schedule' },
      { icon: CircleDollarSign, text: 'Cost-effective', detail: 'Minimal equipment investment needed' },
      { icon: Ruler, text: 'Space-efficient', detail: 'Workouts designed for limited space' }
    ],
    equipment: {
      essential: [
        'Bodyweight exercises',
        'Exercise mat',
        'Resistance bands'
      ],
      available: [
        'Small dumbbells',
        'Pull-up bar',
        'Adjustable bench',
        'Yoga blocks',
        'Foam roller',
        'Jump rope'
      ]
    }
  }
] as const;

const EquipmentStep = ({ onComplete, onValidationChange, initialValue }: EquipmentStepProps) => {
  const [selected, setSelected] = useState<WorkoutLocation | null>(initialValue || null);

  // Separate validation and completion effects
  useEffect(() => {
    onValidationChange?.(!!selected);
  }, [selected, onValidationChange]);

  // Only handle initial value setting
  useEffect(() => {
    if (initialValue && !selected) {
      setSelected(initialValue);
    }
  }, [initialValue]);

  // Handle selection change without causing infinite loop
  const handleSelection = (value: WorkoutLocation) => {
    setSelected(value);
    onComplete(value);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {equipmentOptions.map(({ value, title, description, icon: Icon, color, features, equipment }) => (
          <Card
            key={value}
            isPressable
            isHoverable
            onPress={() => handleSelection(value)} // Use the new handler
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
                    className={selected === value ? 'text-white' : `text-${color}-500`} 
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

              {/* Features */}
              <div className="grid gap-2 mb-4">
                {features.map(({ icon: FeatureIcon, text, detail }) => (
                  <div
                    key={text}
                    className={cn(
                      "flex items-center gap-3 p-2 rounded-lg transition-colors duration-200",
                    )}
                  >
                    <FeatureIcon className={`w-4 h-4 text-${color}-500`} />
                    <div>
                      <p className="text-sm font-medium">{text}</p>
                      <p className="text-xs text-foreground/60">{detail}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Equipment Lists */}
              <div className="space-y-3">
                {/* Essential Equipment */}
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Sparkles className={`w-4 h-4 text-${color}-500`} />
                    <p className="text-sm font-medium">Essential Equipment</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {equipment.essential.map((item) => (
                      <div 
                        key={item}
                        className={cn(
                          "text-xs px-2 py-1.5 rounded-lg",
                          selected === value
                            ? `bg-${color}-500/10 text-${color}-600`
                            : "bg-content2/20"
                        )}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Available Equipment */}
                {/* <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Dumbbell className={`w-4 h-4 text-${color}-500`} />
                    <p className="text-sm font-medium">Available Equipment</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {equipment.available.map((item) => (
                      <div 
                        key={item}
                        className={cn(
                          "text-xs px-2 py-1.5 rounded-lg",
                        )}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div> */}
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Help Text */}
      <Card className="bg-content2">
        <CardBody className="p-3">
          <div className="flex gap-2">
            <AlertCircle className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-foreground/70">
              Choose based on your access and preferences. Both options provide effective workouts 
              when followed consistently. I'll customize your program based on available equipment.
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default EquipmentStep;