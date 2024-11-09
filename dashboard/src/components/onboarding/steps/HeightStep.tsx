// src/components/onboarding/steps/HeightStep.tsx
import { useState, useEffect } from 'react';
import { Input, Card, CardBody, Select, SelectItem } from "@nextui-org/react";
import { Ruler } from 'lucide-react';
import { useStepValidation } from '@/hooks/useStepValidation';

interface HeightStepProps {
  onComplete: (value: number) => void;
  onValidationChange?: (isValid: boolean) => void;
  initialValue?: number;
}

// Utility functions for height conversion
const cmToFeetInches = (cm: number): { feet: number; inches: number } => {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  // Handle case where inches rounds to 12
  if (inches === 12) {
    return { feet: feet + 1, inches: 0 };
  }
  return { feet, inches };
};

const feetInchesToCm = (feet: number, inches: number): number => {
  return Math.round((feet * 12 + inches) * 2.54);
};

const HeightStep = ({ onComplete, onValidationChange, initialValue }: HeightStepProps) => {
  const [unit, setUnit] = useState<'cm' | 'ft'>('cm');
  const [height, setHeight] = useState('');
  const [inches, setInches] = useState('');
  const [error, setError] = useState('');
  const { handleSelect } = useStepValidation<number>(initialValue, onComplete, onValidationChange);

  const validateHeight = (height: string, inches: string = '0') => {
    if (!height) {
      setError('Please enter your height');
      return false;
    }

    let heightInCm: number;
    
    if (unit === 'cm') {
      heightInCm = parseFloat(height);
      if (isNaN(heightInCm) || heightInCm < 100 || heightInCm > 250) {
        setError('Please enter a valid height between 100cm and 250cm');
        return false;
      }
    } else {
      const feet = parseFloat(height);
      const inchesValue = parseFloat(inches);
      if (isNaN(feet) || isNaN(inchesValue) || 
          feet < 3 || feet > 8 || 
          inchesValue < 0 || inchesValue >= 12) {
        setError('Please enter a valid height (3ft - 8ft)');
        return false;
      }
      heightInCm = feetInchesToCm(feet, inchesValue);
    }

    setError(''); // Clear error when height is valid
    handleSelect(Math.round(heightInCm));
    return true;
  };

  const handleHeightChange = (value: string, inchesValue: string = inches) => {
    setHeight(value);
    const isValid = validateHeight(value, inchesValue);
    onValidationChange?.(isValid);
  };

  const handleInchesChange = (value: string) => {
    setInches(value);
    const isValid = validateHeight(height, value);
    onValidationChange?.(isValid);
  };

  // Initialize with initial value if provided
  useEffect(() => {
    if (initialValue) {
      if (unit === 'cm') {
        setHeight(initialValue.toString());
        handleHeightChange(initialValue.toString());
      } else {
        const { feet, inches } = cmToFeetInches(initialValue);
        setHeight(feet.toString());
        setInches(inches.toString());
        handleHeightChange(feet.toString(), inches.toString());
      }
    }
  }, [initialValue, unit]);

  return (
    <div className="space-y-6">
      {/* Height Preview */}
      {!error && height && (
        <div className="flex flex-col items-center gap-2 mb-4">
          <div className="w-16 h-16 rounded-full bg-primary-500/10 flex items-center justify-center">
            <Ruler className="w-8 h-8 text-primary-500" />
          </div>
          <div className="text-center">
            <p className="text-xl font-semibold">
              {unit === 'cm' ? 
                `${height}cm` : 
                `${height}'${inches || '0'}"`}
            </p>
            <p className="text-sm text-foreground/60">
              {unit === 'cm' ? 
                (() => {
                  const { feet, inches } = cmToFeetInches(parseFloat(height));
                  return `${feet}ft ${inches}in`;
                })() :
                `${feetInchesToCm(parseFloat(height), parseFloat(inches || '0'))}cm`}
            </p>
          </div>
        </div>
      )}

      {/* Height Input */}
      <div className="flex gap-3">
        {unit === 'cm' ? (
          <Input
            type="number"
            label="Height"
            placeholder="Enter your height"
            value={height}
            onValueChange={handleHeightChange}
            errorMessage={error}
            isInvalid={!!error}
            variant="underlined"
            color="primary"
            radius="lg"
            startContent={<Ruler className="text-default-400 flex-shrink-0" size={18} />}
            className="flex-1"
            classNames={{
              input: "text-base",
            }}
          />
        ) : (
          <div className="flex gap-2 flex-1">
            <Input
              type="number"
              label="Feet"
              placeholder="5"
              value={height}
              onValueChange={handleHeightChange}
              variant="underlined"
              color="primary"
              radius="lg"
              className="flex-1"
              classNames={{
                input: "text-base",
              }}
            />
            <Input
              type="number"
              label="Inches"
              placeholder="8"
              value={inches}
              onValueChange={handleInchesChange}
              variant="underlined"
              color="primary"
              radius="lg"
              className="flex-1"
              classNames={{
                input: "text-base",
              }}
            />
          </div>
        )}

        <Select
          selectedKeys={[unit]}
          onChange={(e) => {
            const newUnit = e.target.value as 'cm' | 'ft';
            setUnit(newUnit);
            setHeight('');
            setInches('');
            setError('');
            onValidationChange?.(false);
          }}
          variant="underlined"
          color="primary"
          radius="lg"
          className="w-32"
        >
          <SelectItem key="cm" value="cm">cm</SelectItem>
          <SelectItem key="ft" value="ft">ft</SelectItem>
        </Select>
      </div>

      <Card className="bg-content2">
        <CardBody className="p-3">
          <div className="flex items-start gap-2">
            <Ruler className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
            <div className="space-y-2">
              <p className="text-xs text-foreground/70">
                Your height helps me calculate your BMI and determine appropriate fitness goals. Enter your height in either centimeters or feet and inches.
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default HeightStep;