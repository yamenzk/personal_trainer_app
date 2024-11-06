// src/components/onboarding/steps/EquipmentStep.tsx
import { useState } from 'react';
import { Button } from "@nextui-org/react";
import { motion } from "framer-motion";
import { 
  Dumbbell, 
  Building2, 
  Home, 
  Clock, 
  Ruler, 
  CircleDollarSign,
  Trophy,
  AlertCircle
} from 'lucide-react';

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
        { icon: Trophy, text: 'Maximum exercise variety' }
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
  ];

  const handleSubmit = () => {
    if (!selected) {
      setError('Please select your workout location');
      return;
    }
    onComplete(selected);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map(({ value, title, description, icon: Icon, color, features, equipment }) => (
          <motion.button
            key={value}
            onClick={() => {
              setSelected(value);
              setError('');
            }}
            className={`
              w-full p-6 rounded-xl text-left transition-all duration-300
              ${selected === value 
                ? `bg-${color}-500/20 border-2 border-${color}-500` 
                : 'bg-content/5 rounded-xl shadow-inner bg-white/5 backdrop-blur-md border-content/10 hover:border-content/20'
              }
            `}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start gap-4">
                <div className={`
                  w-12 h-12 rounded-xl 
                  ${selected === value ? `bg-${color}-500` : `bg-${color}-500/10`}
                  flex items-center justify-center
                `}>
                  <Icon 
                    className={selected === value ? 'text-white' : `text-${color}-500`} 
                    size={24} 
                  />
                </div>
                <div>
                  <h3 className="font-medium text-lg">{title}</h3>
                  <p className="text-sm text-foreground/60">{description}</p>
                </div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-3">
                {features.map(({ icon: FeatureIcon, text }) => (
                  <div
                    key={text}
                    className={`p-2 rounded-lg bg-${color}-500/10 text-center`}
                  >
                    <FeatureIcon 
                      className={`w-4 h-4 text-${color}-500 mx-auto mb-1`}
                    />
                    <span className="text-xs">{text}</span>
                  </div>
                ))}
              </div>

              {/* Equipment List */}
              <div className="space-y-2">
                <p className="text-sm font-medium">Available Equipment:</p>
                <div className="grid grid-cols-2 gap-2">
                  {equipment.map((item) => (
                    <div 
                      key={item}
                      className="flex items-center gap-2 text-sm text-foreground/60"
                    >
                      <div className={`w-1 h-1 rounded-full bg-${color}-500`} />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Info Box */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-primary-500/5">
        <AlertCircle className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-foreground/70">
          Choose based on your available resources and preferences. Both options can provide effective workouts when followed consistently.
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