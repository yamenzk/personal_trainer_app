// src/components/onboarding/steps/TargetWeightStep.tsx
import { useState } from 'react';
import { Input, Button, Select, SelectItem } from "@nextui-org/react";
import { motion } from "framer-motion";
import { Target, Scale, TrendingDown, TrendingUp, AlertCircle } from 'lucide-react';

interface TargetWeightStepProps {
  onComplete: (value: number) => void;
  currentWeight: number;  // This is now guaranteed to have the latest weight
  isLoading?: boolean;
}

const TargetWeightStep = ({ onComplete, currentWeight, isLoading = false }: TargetWeightStepProps) => {
  const [unit, setUnit] = useState<'kg' | 'lb'>('kg');
  const [weight, setWeight] = useState('');
  const [error, setError] = useState('');

  const currentWeightInUnit = unit === 'lb' ? 
    Math.round(currentWeight * 2.20462 * 10) / 10 : 
    currentWeight;

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

    // Validate against current weight
    const weightDiff = Math.abs(weightInKg - currentWeight);
    const maxChange = currentWeight * 0.5; // Max 50% change from current weight
    
    if (weightDiff > maxChange) {
      setError('Please set a more realistic target (within 50% of current weight)');
      return;
    }

    onComplete(Math.round(weightInKg * 10) / 10);
  };

  const getWeightDifference = () => {
    if (!weight) return null;
    const targetWeight = parseFloat(weight);
    if (isNaN(targetWeight)) return null;
    
    const diff = currentWeightInUnit - targetWeight;
    return {
      value: Math.abs(diff).toFixed(1),
      type: diff > 0 ? 'lose' as const : 'gain' as const
    };
  };

  const difference = getWeightDifference();

  return (
    <div className="space-y-8">
      {/* Current Weight Display */}
      <div className="p-6 rounded-xl bg-gradient-to-br from-primary-500/10 to-secondary-500/10 border border-primary-500/20">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-lg bg-primary-500/20">
            <Scale className="w-6 h-6 text-primary-500" />
          </div>
          <div>
            <p className="text-sm text-foreground/60">Current Weight</p>
            <p className="text-xl font-semibold">{currentWeightInUnit} {unit}</p>
          </div>
        </div>
      </div>

      {/* Weight Input */}
      <div className="flex gap-4">
        <Input
          type="number"
          label="Target Weight"
          value={weight}
          onValueChange={(value) => {
            setWeight(value);
            setError('');
          }}
          errorMessage={error}
          isInvalid={!!error}
          variant="underlined"
            color="primary"
        />

        <Select
          label="Unit"
          value={unit}
          defaultSelectedKeys={["kg"]}
          variant="underlined"
            color="primary"
          onChange={(e) => {
            setUnit(e.target.value as 'kg' | 'lb');
            setWeight('');
            setError('');
          }}
          className="w-32"
        >
          <SelectItem key="kg" value="kg">kg</SelectItem>
          <SelectItem key="lb" value="lb">lb</SelectItem>
        </Select>
      </div>

      {/* Weight Change Visualization */}
      {difference && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl ${
            difference.type === 'lose' 
              ? 'bg-success-500/10 border border-success-500/20' 
              : 'bg-warning-500/10 border border-warning-500/20'
          }`}
        >
          <div className="flex items-center gap-3">
            {difference.type === 'lose' ? (
              <TrendingDown className="w-5 h-5 text-success-500" />
            ) : (
              <TrendingUp className="w-5 h-5 text-warning-500" />
            )}
            <div>
              <p className="font-medium">
                You want to {difference.type} {difference.value} {unit}
              </p>
              <p className="text-sm text-foreground/60">
                {difference.type === 'lose' 
                  ? 'Through proper nutrition and exercise'
                  : 'Through muscle gain and proper nutrition'
                }
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Info Box */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-primary-500/5">
        <AlertCircle className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-foreground/70">
          Set a realistic target weight that you can achieve through healthy lifestyle changes. 
          Aim for steady progress rather than rapid changes.
        </p>
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

export default TargetWeightStep;