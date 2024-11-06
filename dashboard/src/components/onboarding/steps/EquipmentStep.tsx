import { useState } from 'react';
import { Button, Chip, Divider } from "@nextui-org/react";
import { 
  Dumbbell, 
  Building2, 
  Home, 
  Clock, 
  Ruler, 
  CircleDollarSign,
  Trophy,
  AlertCircle,
  Check
} from 'lucide-react';
import { cn } from '@/utils/cn';

interface EquipmentStepProps {
  onComplete: (value: 'Gym' | 'Home') => void;
  isLoading?: boolean;
}

const EquipmentStep = ({ onComplete, isLoading = false }: EquipmentStepProps) => {
  const [selected, setSelected] = useState<'Gym' | 'Home' | null>(null);
  const [error, setError] = useState('');

  const options = [
    {
      value: 'Gym' as const,
      title: 'Gym Access',
      description: 'Full equipment availability',
      icon: Building2,
      color: 'primary',
      features: [
        { icon: Dumbbell, text: 'Professional equipment' },
        { icon: Clock, text: 'Flexible workout times' },
        { icon: Trophy, text: 'Maximum variety' }
      ],
      equipment: [
        'Weight machines',
        'Free weights',
        'Cardio equipment',
        'Resistance bands',
        'Cable machines',
        'Smith machines'
      ]
    },
    {
      value: 'Home' as const,
      title: 'Home Workouts',
      description: 'Minimal equipment needed',
      icon: Home,
      color: 'secondary',
      features: [
        { icon: Clock, text: 'Time-efficient' },
        { icon: CircleDollarSign, text: 'Cost-effective' },
        { icon: Ruler, text: 'Space-efficient' }
      ],
      equipment: [
        'Bodyweight exercises',
        'Resistance bands',
        'Small dumbbells',
        'Exercise mat',
        'Pull-up bar (optional)',
        'Adjustable bench (optional)'
      ]
    }
  ] as const;

  const handleSubmit = () => {
    if (!selected) {
      setError('Please select your workout location');
      return;
    }
    onComplete(selected);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        {options.map(({ value, title, description, icon: Icon, color, features, equipment }) => (
          
          <button
            key={value}
            onClick={() => {
              setSelected(value);
              setError('');
            }}
            className={cn(
              "w-full text-left",
              "transition-all duration-150",
              "active:scale-[0.98]",
              "outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
              "rounded-xl overflow-hidden"
            )}
          >
            <Divider className="my-4" />
            {/* Main Card */}
            <div className={cn(
              "p-4",
              "transition-colors duration-150",
              selected === value 
                ? `bg-${color}-500/20 ring-2 ring-${color}-500` 
                : 'bg-content/5 hover:bg-content/10'
            )}>
              {/* Header */}
              <div className="flex items-start gap-3 mb-4">
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                  "transition-colors duration-150",
                  selected === value
                    ? `bg-${color}-500`
                    : `bg-${color}-500/10`
                )}>
                  <Icon 
                    className={selected === value ? 'text-white' : `text-${color}-500`} 
                    size={20} 
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-medium">{title}</h3>
                      <p className="text-sm text-foreground/60">{description}</p>
                    </div>
                    {selected === value && (
                      <Chip
                        size="sm"
                        color={color}
                        startContent={<Check size={12} />}
                      >
                        Selected
                      </Chip>
                    )}
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {features.map(({ icon: FeatureIcon, text }) => (
                  <div
                    key={text}
                    className={cn(
                      "p-2 rounded-lg text-center",
                      `bg-${color}-500/5`
                    )}
                  >
                    <FeatureIcon 
                      className={`w-4 h-4 text-${color}-500 mx-auto mb-1`}
                    />
                    <span className="text-xs line-clamp-1">{text}</span>
                  </div>
                ))}
              </div>

              {/* Equipment Grid */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                {equipment.map((item) => (
                  <div 
                    key={item}
                    className="flex items-center gap-2 py-1"
                  >
                    <div className={cn(
                      "w-1 h-1 rounded-full",
                      `bg-${color}-500`
                    )} />
                    <span className="text-sm text-foreground/60 line-clamp-1">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Compact Info Box */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary-500/5">
        <AlertCircle className="w-4 h-4 text-primary-500 shrink-0" />
        <p className="text-xs text-foreground/70">
          Both options provide effective workouts when followed consistently
        </p>
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

export default EquipmentStep;