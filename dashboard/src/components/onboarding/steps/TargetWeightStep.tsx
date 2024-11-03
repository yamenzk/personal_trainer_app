// src/components/onboarding/steps/TargetWeightStep.tsx
import { useState } from 'react';
import { Card, Input, Button, Select, SelectItem } from "@nextui-org/react";
import { motion } from "framer-motion";
import { Target } from 'lucide-react';
import { TargetWeightStepProps } from '../../../types/onboarding';

const TargetWeightStep: React.FC<TargetWeightStepProps> = ({ onComplete, currentWeight }) => {
  const [unit, setUnit] = useState<'kg' | 'lb'>('kg');
  const [weight, setWeight] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!weight) {
      setError('Please enter your target weight');
      return;
    }

    const weightValue = parseFloat(weight);
    if (isNaN(weightValue) || weightValue <= 0) {
      setError('Please enter a valid weight');
      return;
    }

    // Convert to kg if needed
    const weightInKg = unit === 'lb' ? weightValue * 0.453592 : weightValue;

    // Validate reasonable range (30kg - 300kg)
    if (weightInKg < 30 || weightInKg > 300) {
      setError('Please enter a reasonable weight');
      return;
    }

    // Validate against current weight
    const weightDiff = Math.abs(weightInKg - currentWeight);
    if (weightDiff > 100) {
      setError('Target weight should be within a reasonable range of your current weight');
      return;
    }

    onComplete(Math.round(weightInKg * 10) / 10); // Round to 1 decimal place
  };

  const currentWeightInUnit = unit === 'lb' ? 
    Math.round(currentWeight * 2.20462 * 10) / 10 : 
    currentWeight;

  return (
    <Card className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold">What's your target weight?</h2>
          <p className="text-sm text-foreground/60">
            This helps us create a program aligned with your goals
          </p>
          <p className="text-sm font-medium">
            Current weight: {currentWeightInUnit} {unit}
          </p>
        </div>

        <div className="flex gap-4">
          <Input
            type="number"
            label="Target Weight"
            placeholder={`Enter your target weight in ${unit}`}
            value={weight}
            onChange={(e) => {
              setWeight(e.target.value);
              setError('');
            }}
            startContent={<Target className="text-default-400" size={20} />}
            errorMessage={error}
            isInvalid={!!error}
            className="flex-1"
          />
          
          <Select
            label="Unit"
            value={unit}
            onChange={(e) => {
              setUnit(e.target.value as 'kg' | 'lb');
              setWeight('');
            }}
            className="w-32"
          >
            <SelectItem key="kg" value="kg">kg</SelectItem>
            <SelectItem key="lb" value="lb">lb</SelectItem>
          </Select>
        </div>

        <Button
          color="primary"
          size="lg"
          className="w-full"
          onClick={handleSubmit}
        >
          Complete
        </Button>
      </motion.div>
    </Card>
  );
};

export default TargetWeightStep;