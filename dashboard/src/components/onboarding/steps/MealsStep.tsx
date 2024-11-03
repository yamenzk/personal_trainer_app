// src/components/onboarding/steps/MealsStep.tsx
import { useState } from 'react';
import { Card, Button, RadioGroup, Radio } from "@nextui-org/react";
import { motion } from "framer-motion";
import { MealsStepProps } from '../../../types/onboarding';

const MealsStep: React.FC<MealsStepProps> = ({ onComplete }) => {
  const [meals, setMeals] = useState<string>('');
  const [error, setError] = useState('');

  const mealOptions = [
    {
      value: '3',
      title: '3 meals',
      description: 'Traditional schedule'
    },
    {
      value: '4',
      title: '4 meals',
      description: 'Includes afternoon snack'
    },
    {
      value: '5',
      title: '5 meals',
      description: 'Multiple small meals'
    },
    {
      value: '6',
      title: '6 meals',
      description: 'Frequent small portions'
    }
  ];

  const handleSubmit = () => {
    if (!meals) {
      setError('Please select your preferred number of meals');
      return;
    }

    onComplete(parseInt(meals));
  };

  return (
    <Card className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold">How many meals per day?</h2>
          <p className="text-sm text-foreground/60">
            We'll create a meal plan that fits your schedule and helps you reach your goals
          </p>
        </div>

        <RadioGroup
          value={meals}
          onValueChange={setMeals}
          className="gap-3"
          isInvalid={!!error}
          errorMessage={error}
        >
          {mealOptions.map((option) => (
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

export default MealsStep;