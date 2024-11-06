import { useState } from 'react';
import { Button } from "@nextui-org/react";
import { motion } from "framer-motion";
import { Coffee, Utensils, Cookie, ChefHat } from 'lucide-react';

interface MealsStepProps {
  onComplete: (value: number) => void;
  isLoading?: boolean;
}

const MealsStep = ({ onComplete, isLoading = false }: MealsStepProps) => {
  const [selected, setSelected] = useState<number | null>(null);
  const [error, setError] = useState('');

  const mealOptions = [
    {
      value: 3,
      title: '3 Meals',
      description: 'Traditional schedule',
      schedule: ['Breakfast', 'Lunch', 'Dinner'],
      color: 'primary',
      icon: Coffee,
      details: 'Best for busy schedules'
    },
    {
      value: 4,
      title: '4 Meals',
      description: 'With afternoon snack',
      schedule: ['Breakfast', 'Lunch', 'Snack', 'Dinner'],
      color: 'secondary',
      icon: Cookie,
      details: 'Balanced energy levels'
    },
    {
      value: 5,
      title: '5 Meals',
      description: 'Frequent small portions',
      schedule: ['Breakfast', 'Morning Snack', 'Lunch', 'Afternoon Snack', 'Dinner'],
      color: 'success',
      icon: Utensils,
      details: 'Optimal for muscle gain'
    },
    {
      value: 6,
      title: '6 Meals',
      description: 'Professional athlete plan',
      schedule: ['Early Breakfast', 'Late Breakfast', 'Lunch', 'Afternoon Snack', 'Dinner', 'Evening Snack'],
      color: 'warning',
      icon: ChefHat,
      details: 'Maximum nutrient timing'
    }
  ];

  const handleSubmit = () => {
    if (!selected) {
      setError('Please select your preferred meal frequency');
      return;
    }
    onComplete(selected);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        {mealOptions.map(({ value, title, description, schedule, color, icon: Icon, details }) => (
          <motion.button
            key={value}
            onClick={() => {
              setSelected(value);
              setError('');
            }}
            className={`
              w-full p-4 rounded-xl text-left transition-all duration-300
              ${selected === value 
                ? `bg-${color}-500/20 border-2 border-${color}-500` 
                : 'bg-content/5 rounded-xl shadow-inner bg-white/5 backdrop-blur-md border-content/10 hover:border-content/20'
              }
            `}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className={`
                w-12 h-12 rounded-lg flex-shrink-0 
                ${selected === value ? `bg-${color}-500` : `bg-${color}-500/10`}
                flex items-center justify-center
              `}>
                <Icon 
                  className={selected === value ? 'text-white' : `text-${color}-500`} 
                  size={24} 
                />
              </div>
              
              <div className="flex-1 space-y-2">
                <div>
                  <h3 className="font-medium">{title}</h3>
                  <p className="text-sm text-foreground/60">{description}</p>
                </div>

                {selected === value && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3"
                  >
                    {/* Schedule Timeline */}
                    <div className="flex items-center gap-2 overflow-x-auto py-2">
                      {schedule.map((meal, index) => (
                        <div key={meal} className="flex items-center">
                          <div className={`px-3 py-1 rounded-full bg-${color}-500/10 text-${color}-500 text-sm whitespace-nowrap`}>
                            {meal}
                          </div>
                          {index < schedule.length - 1 && (
                            <div className={`w-8 h-px bg-${color}-500/20`} />
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Additional Details */}
                    <p className="text-sm text-foreground/60">{details}</p>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.button>
        ))}
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

export default MealsStep;
