// src/components/onboarding/steps/WorkoutsStep.tsx
import { useState } from 'react';
import { Card, Button, RadioGroup, Radio } from "@nextui-org/react";
import { motion } from "framer-motion";
import { WorkoutsStepProps } from '../../../types/onboarding';

const WorkoutsStep: React.FC<WorkoutsStepProps> = ({ onComplete }) => {
  const [workouts, setWorkouts] = useState<string>('');
  const [error, setError] = useState('');

  const workoutOptions = [
    {
      value: '3',
      title: '3 workouts',
      description: 'Ideal for beginners'
    },
    {
      value: '4',
      title: '4 workouts',
      description: 'Balanced commitment'
    },
    {
      value: '5',
      title: '5 workouts',
      description: 'Intermediate level'
    },
    {
      value: '6',
      title: '6 workouts',
      description: 'Advanced training'
    }
  ];

  const handleSubmit = () => {
    if (!workouts) {
      setError('Please select your preferred number of workouts');
      return;
    }

    onComplete(parseInt(workouts));
  };

  return (
    <Card className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold">How many workouts per week?</h2>
          <p className="text-sm text-foreground/60">
            We'll design a training schedule that matches your availability and goals
          </p>
        </div>

        <RadioGroup
          value={workouts}
          onValueChange={setWorkouts}
          className="gap-3"
          isInvalid={!!error}
          errorMessage={error}
        >
          {workoutOptions.map((option) => (
            <Radio key={option.value} value={option.value}>
              <div className="flex flex-col">
                <span className="text-base">{option.title}</span>
                <span className="text-xs text-foreground/60">{option.description}</span>
              </div>
            </Radio>
          ))}
        </RadioGroup>

        <Button
          color="primary"
          size="lg"
          className="w-full"
          onClick={handleSubmit}
        >
          Continue
        </Button>
      </motion.div>
    </Card>
  );
};

export default WorkoutsStep;