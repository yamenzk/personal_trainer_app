// src/components/onboarding/steps/WorkoutsStep.tsx
import { useState } from 'react';
import { Button } from "@nextui-org/react";
import { motion } from "framer-motion";
import { Calendar, Clock, Dumbbell, Trophy, ChartBar } from 'lucide-react';

interface WorkoutsStepProps {
  onComplete: (value: number) => void;
  isLoading?: boolean;
}

const WorkoutsStep = ({ onComplete, isLoading = false }: WorkoutsStepProps) => {
  const [selected, setSelected] = useState<number | null>(null);
  const [error, setError] = useState('');

  const workoutOptions = [
    {
      value: 3,
      title: '3 Workouts',
      description: 'Beginner Friendly',
      schedule: ['Mon', 'Wed', 'Fri'],
      commitment: 'Low',
      duration: '45-60 min',
      intensity: 1,
      color: 'primary',
      benefits: ['Perfect for beginners', 'Good recovery time', 'Balanced lifestyle']
    },
    {
      value: 4,
      title: '4 Workouts',
      description: 'Balanced Approach',
      schedule: ['Mon', 'Tue', 'Thu', 'Fri'],
      commitment: 'Medium',
      duration: '45-60 min',
      intensity: 2,
      color: 'secondary',
      benefits: ['Consistent progress', 'Flexible schedule', 'Good results']
    },
    {
      value: 5,
      title: '5 Workouts',
      description: 'Intermediate Level',
      schedule: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      commitment: 'High',
      duration: '60-75 min',
      intensity: 3,
      color: 'success',
      benefits: ['Faster results', 'Better conditioning', 'Strength gains']
    },
    {
      value: 6,
      title: '6 Workouts',
      description: 'Advanced Training',
      schedule: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      commitment: 'Very High',
      duration: '60-90 min',
      intensity: 4,
      color: 'warning',
      benefits: ['Maximum results', 'Athletic performance', 'Body recomposition']
    }
  ];

  const handleSubmit = () => {
    if (!selected) {
      setError('Please select your preferred workout frequency');
      return;
    }
    onComplete(selected);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        {workoutOptions.map(({
          value,
          title,
          description,
          schedule,
          commitment,
          duration,
          intensity,
          color,
          benefits
        }) => (
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
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium">{title}</h3>
                  <p className="text-sm text-foreground/60">{description}</p>
                </div>
                <div className="flex gap-1">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className={`
                        w-1.5 h-6 rounded-full transition-colors
                        ${i < intensity 
                          ? selected === value 
                            ? `bg-${color}-500` 
                            : `bg-${color}-500/50`
                          : 'bg-content/10'
                        }
                      `}
                    />
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className={`p-2 rounded-lg bg-${color}-500/10 text-center`}>
                  <Clock className={`w-4 h-4 text-${color}-500 mx-auto mb-1`} />
                  <span className="text-xs">{duration}</span>
                </div>
                <div className={`p-2 rounded-lg bg-${color}-500/10 text-center`}>
                  <Calendar className={`w-4 h-4 text-${color}-500 mx-auto mb-1`} />
                  <span className="text-xs">{commitment}</span>
                </div>
                <div className={`p-2 rounded-lg bg-${color}-500/10 text-center`}>
                  <Dumbbell className={`w-4 h-4 text-${color}-500 mx-auto mb-1`} />
                  <span className="text-xs">{value}x/week</span>
                </div>
              </div>

              {/* Expanded Content */}
              {selected === value && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  {/* Weekly Schedule */}
                  <div className="flex gap-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                      <div
                        key={day}
                        className={`
                          w-10 h-10 rounded-lg flex items-center justify-center text-sm
                          ${schedule.includes(day) 
                            ? `bg-${color}-500 text-white` 
                            : 'bg-content/5 text-foreground/40'
                          }
                        `}
                      >
                        {day.charAt(0)}
                      </div>
                    ))}
                  </div>

                  {/* Benefits */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Trophy className={`w-4 h-4 text-${color}-500`} />
                      <span className="font-medium">Benefits</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {benefits.map((benefit, index) => (
                        <div
                          key={index}
                          className={`px-3 py-2 rounded-lg bg-${color}-500/5 text-sm text-center`}
                        >
                          {benefit}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Progress Chart */}
                  <div className={`p-3 rounded-lg bg-${color}-500/5 space-y-2`}>
                    <div className="flex items-center gap-2">
                      <ChartBar className={`w-4 h-4 text-${color}-500`} />
                      <span className="text-sm font-medium">Expected Progress</span>
                    </div>
                    <div className="h-2 rounded-full bg-content/10 overflow-hidden">
                      <div
                        className={`h-full bg-${color}-500 rounded-full transition-all duration-1000`}
                        style={{ width: `${value * 15}%` }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
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

export default WorkoutsStep;