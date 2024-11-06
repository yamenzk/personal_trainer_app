// src/components/onboarding/steps/WeightStep.tsx
import { useState } from 'react';
import { Input, Button, Select, SelectItem } from "@nextui-org/react";
import { motion } from "framer-motion";
import { Scale } from 'lucide-react';

interface WeightStepProps {
  onComplete: (value: number) => void;
  isLoading?: boolean;
}

const WeightStep = ({ onComplete, isLoading = false }: WeightStepProps) => {
  const [unit, setUnit] = useState<'kg' | 'lb'>('kg');
  const [weight, setWeight] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!weight) {
      setError('Please enter your current weight');
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

    onComplete(Math.round(weightInKg * 10) / 10); // Round to 1 decimal place
  };

  return (
    <div className="space-y-8">
      <div className="flex gap-4">
        <Input
          type="number"
          label="Weight"
          value={weight}
          onValueChange={(value) => {
            setWeight(value);
            setError('');
          }}
          errorMessage={error}
          isInvalid={!!error}
          startContent={<Scale className="text-default-400" size={18} />}
          endContent={
            <div className="pointer-events-none text-default-400">
              {unit}
            </div>
          }
          classNames={{
            label: "text-foreground/90",
            input: [
              "bg-transparent",
              "text-foreground/90",
              "placeholder:text-foreground/50",
            ],
            innerWrapper: "bg-transparent",
            inputWrapper: [
              "shadow-sm",
              "bg-content/10",
              "backdrop-blur-sm",
              "hover:bg-content/20",
              "group-data-[focused=true]:bg-content/20",
              "!cursor-text",
            ],
          }}
        />
        
        <Select
          label="Unit"
          value={unit}
          defaultSelectedKeys={["kg"]}
          onChange={(e) => {
            setUnit(e.target.value as 'kg' | 'lb');
            setWeight('');
            setError('');
          }}
          className="w-32"
          classNames={{
            trigger: "bg-content/10 backdrop-blur-sm",
            value: "text-foreground/90",
          }}
        >
          <SelectItem key="kg" value="kg">kg</SelectItem>
          <SelectItem key="lb" value="lb">lb</SelectItem>
        </Select>
      </div>

      {/* Weight ranges info */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-primary-500/5 space-y-1 text-center">
          <p className="text-sm text-foreground/60">Underweight</p>
          <p className="font-medium">Below {unit === 'kg' ? '50' : '110'} {unit}</p>
        </div>
        <div className="p-4 rounded-xl bg-success-500/5 space-y-1 text-center">
          <p className="text-sm text-foreground/60">Healthy</p>
          <p className="font-medium">
            {unit === 'kg' ? '50 - 100' : '110 - 220'} {unit}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-warning-500/5 space-y-1 text-center">
          <p className="text-sm text-foreground/60">Overweight</p>
          <p className="font-medium">Above {unit === 'kg' ? '100' : '220'} {unit}</p>
        </div>
      </div>

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

export default WeightStep;