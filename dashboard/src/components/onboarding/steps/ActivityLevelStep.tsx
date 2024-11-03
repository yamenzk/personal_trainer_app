// src/components/onboarding/steps/ActivityLevelStep.tsx
import { useState } from 'react';
import { Card, Button, RadioGroup, Radio } from "@nextui-org/react";
import { motion } from "framer-motion";
import { ActivityLevelStepProps } from '../../../types/onboarding';

type ActivityLevel = 'Sedentary' | 'Light' | 'Moderate' | 'Very Active' | 'Extra Active';

const ActivityLevelStep: React.FC<ActivityLevelStepProps> = ({ onComplete }) => {
  const [level, setLevel] = useState<ActivityLevel>();
  const [error, setError] = useState('');

  const activityLevels: Array<{
    value: ActivityLevel;
    title: string;
    description: string;
  }> = [
    {
      value: 'Sedentary',
      title: 'Sedentary',
      description: 'Little or no exercise, desk job'
    },
    {
      value: 'Light',
      title: 'Lightly Active',
      description: 'Light exercise 1-3 days/week'
    },
    {
      value: 'Moderate',
      title: 'Moderately Active',
      description: 'Moderate exercise 3-5 days/week'
    },
    {
      value: 'Very Active',
      title: 'Very Active',
      description: 'Hard exercise 6-7 days/week'
    },
    {
      value: 'Extra Active',
      title: 'Extra Active',
      description: 'Very hard exercise, physical job or training twice per day'
    }
  ];

  const handleSubmit = () => {
    if (!level) {
      setError('Please select your activity level');
      return;
    }
    onComplete(level);
  };

  return (
    <Card className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold">What's your activity level?</h2>
          <p className="text-sm text-foreground/60">
            This helps us calculate your daily energy needs more accurately
          </p>
        </div>

        <RadioGroup
          value={level}
          onValueChange={(value) => {
            setLevel(value as ActivityLevel);
            setError('');
          }}
          isInvalid={!!error}
          errorMessage={error}
        >
          {activityLevels.map((activity) => (
            <Radio key={activity.value} value={activity.value}>
              <div className="flex flex-col">
                <span className="text-base">{activity.title}</span>
                <span className="text-xs text-foreground/60">
                  {activity.description}
                </span>
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

export default ActivityLevelStep;