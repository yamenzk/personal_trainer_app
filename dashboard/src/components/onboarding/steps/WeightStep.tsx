// src/components/onboarding/steps/WeightStep.tsx
import { useState, useEffect } from 'react';
import { Input, Select, SelectItem, Card, CardBody } from "@nextui-org/react";
import { Scale, AlertCircle } from 'lucide-react';

interface WeightStepProps {
  onComplete: (value: number) => void;
  onValidationChange?: (isValid: boolean) => void;
  initialValue?: number;
}

const WeightStep = ({ onComplete, onValidationChange, initialValue }: WeightStepProps) => {
  const [unit, setUnit] = useState<'kg' | 'lb'>('kg');
  const [weight, setWeight] = useState('');
  const [error, setError] = useState('');

  const validateWeight = (value: string) => {
    if (!value) {
      setError('Please enter your current weight');
      return false;
    }

    const weightValue = parseFloat(value);
    if (isNaN(weightValue) || weightValue <= 0) {
      setError('Please enter a valid weight');
      return false;
    }

    const weightInKg = unit === 'lb' ? weightValue * 0.453592 : weightValue;

    if (weightInKg < 30 || weightInKg > 300) {
      setError('Please enter a reasonable weight (30kg - 300kg)');
      return false;
    }

    setError('');
    onComplete(Math.round(weightInKg * 10) / 10);
    return true;
  };

  const handleWeightChange = (value: string) => {
    setWeight(value);
    const isValid = validateWeight(value);
    onValidationChange?.(isValid);
  };

  // Initialize with initial value if provided
  useEffect(() => {
    if (initialValue) {
      const displayWeight = unit === 'lb' ? 
        (initialValue * 2.20462).toFixed(1) : 
        initialValue.toString();
      setWeight(displayWeight);
      handleWeightChange(displayWeight);
    }
  }, [initialValue, unit]);

  const getWeightCategory = (weightKg: number) => {
    if (weightKg < 50) return { label: 'Light', color: 'primary' };
    if (weightKg < 80) return { label: 'Medium', color: 'success' };
    return { label: 'Heavy', color: 'secondary' };
  };

  const currentWeightKg = parseFloat(weight) * (unit === 'lb' ? 0.453592 : 1);
  const weightCategory = !isNaN(currentWeightKg) ? getWeightCategory(currentWeightKg) : null;

  return (
    <div className="space-y-6">
      {/* Weight Preview */}
      {!error && weight && !isNaN(parseFloat(weight)) && (
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-full bg-primary-500/10 flex items-center justify-center">
            <Scale className="w-8 h-8 text-primary-500" />
          </div>
          <div className="text-center">
            <p className="text-xl font-semibold">
              {weight} {unit}
            </p>
            <p className="text-sm text-foreground/60">
              {unit === 'kg' ? 
                `${(parseFloat(weight) * 2.20462).toFixed(1)} lb` : 
                `${(parseFloat(weight) * 0.453592).toFixed(1)} kg`}
            </p>
          </div>
        </div>
      )}

      {/* Weight Input */}
      <div className="flex gap-3">
        <Input
          type="number"
          label="Weight"
          value={weight}
          onValueChange={handleWeightChange}
          errorMessage={error}
          isInvalid={!!error}
          variant="underlined"
          color="primary"
          radius="lg"
        />

        <Select
          label="Unit"
          selectedKeys={[unit]}
          onChange={(e) => {
            const newUnit = e.target.value as 'kg' | 'lb';
            setUnit(newUnit);
            if (weight && !isNaN(parseFloat(weight))) {
              const newWeight = newUnit === 'lb' ? 
                (parseFloat(weight) * 2.20462).toFixed(1) : 
                (parseFloat(weight) * 0.453592).toFixed(1);
              handleWeightChange(newWeight);
            } else {
              setWeight('');
              setError('');
              onValidationChange?.(false);
            }
          }}
          variant="underlined"
          color="primary"
          radius="lg"
          className="w-32"
        >
          <SelectItem key="kg" value="kg">kg</SelectItem>
          <SelectItem key="lb" value="lb">lb</SelectItem>
        </Select>
      </div>

      {/* Info Card */}
      <Card className="bg-content2">
        <CardBody className="p-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
            <div className="space-y-2">
              <p className="text-xs text-foreground/70">
                Your current weight helps me understand your starting point and calculate appropriate fitness goals.
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default WeightStep;