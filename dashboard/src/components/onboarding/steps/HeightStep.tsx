import { useState, useEffect } from 'react';
import { Input, Switch, Card, CardBody } from "@nextui-org/react";
import { Ruler, Info } from 'lucide-react';
import { cn } from '@/utils/cn';

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
  const [isImperial, setIsImperial] = useState(false);
  const [height, setHeight] = useState('');
  const [inches, setInches] = useState('');
  const [error, setError] = useState('');
  const [baseHeightCm, setBaseHeightCm] = useState<number | null>(null);

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

    setError('');
    setBaseHeightCm(heightInCm);
    onComplete(heightInCm);
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

  const updateDisplayHeight = (newUnit: 'cm' | 'ft', baseCm: number | null) => {
    if (baseCm === null) return;

    if (newUnit === 'cm') {
      setHeight(baseCm.toString());
      setInches('');
    } else {
      const { feet, inches: inchesValue } = cmToFeetInches(baseCm);
      setHeight(feet.toString());
      setInches(inchesValue.toString());
    }
  };

  // Handle initial value
  useEffect(() => {
    if (initialValue) {
      setBaseHeightCm(initialValue);
      updateDisplayHeight(unit, initialValue);
    }
  }, [initialValue]);

  // Handle unit toggle
  const handleUnitToggle = (isSelected: boolean) => {
    setIsImperial(isSelected);
    const newUnit = isSelected ? 'ft' : 'cm';
    setUnit(newUnit);
    updateDisplayHeight(newUnit, baseHeightCm);
  };

  const getConversionDisplay = () => {
    if (!baseHeightCm) return null;
    
    if (unit === 'cm') {
      const { feet, inches: inchesValue } = cmToFeetInches(baseHeightCm);
      return `${feet}'${inchesValue}"`;
    } else {
      return `${baseHeightCm}cm`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Height Display */}
      {!error && height && (
        <div className="flex flex-col items-center gap-3">
          <div className="w-20 h-20 rounded-full bg-gradient-to-b from-primary-500/20 to-background flex items-center justify-center">
            <Ruler className="w-10 h-10 text-primary-500" />
          </div>
          <div className="text-center space-y-1">
            <p className="text-2xl font-semibold text-foreground">
              {unit === 'cm' ? 
                `${height}cm` : 
                `${height}'${inches || '0'}"`}
            </p>
            <p className="text-sm text-foreground/60">
              {getConversionDisplay()}
            </p>
          </div>
        </div>
      )}

      {/* Input Section */}
      <div className="space-y-4">
        {/* Unit Switch */}
        <div className="flex justify-center items-center gap-3">
          <span className={cn(
            "text-sm font-medium",
            !isImperial ? "text-primary-500" : "text-foreground/60"
          )}>CM</span>
          <Switch 
            isSelected={isImperial}
            size="lg"
            color="primary"
            onValueChange={handleUnitToggle}
          />
          <span className={cn(
            "text-sm font-medium",
            isImperial ? "text-primary-500" : "text-foreground/60"
          )}>FT</span>
        </div>

        {/* Height Input */}
        <div className="max-w-xs mx-auto space-y-3">
          {unit === 'cm' ? (
            <Input
              type="number"
              label="Height in centimeters"
              placeholder="175"
              value={height}
              onValueChange={handleHeightChange}
              errorMessage={error}
              isInvalid={!!error}
              variant="bordered"
              radius="lg"
              startContent={
                <Ruler className="w-4 h-4 text-foreground/50" />
              }
              endContent={
                <div className="pointer-events-none text-foreground/50">
                  cm
                </div>
              }
            />
          ) : (
            <div className="flex gap-2">
              <Input
                type="number"
                label="Feet"
                placeholder="5"
                value={height}
                onValueChange={handleHeightChange}
                variant="bordered"
                radius="lg"
                startContent={
                  <Ruler className="w-4 h-4 text-foreground/50" />
                }
                endContent={
                  <div className="pointer-events-none text-foreground/50">
                    ft
                  </div>
                }
              />
              <Input
                type="number"
                label="Inches"
                placeholder="8"
                value={inches}
                onValueChange={handleInchesChange}
                variant="bordered"
                radius="lg"
                endContent={
                  <div className="pointer-events-none text-foreground/50">
                    in
                  </div>
                }
              />
            </div>
          )}
          {error && (
            <p className="text-danger text-sm px-2">
              {error}
            </p>
          )}
        </div>

        <Card className="bg-content2">
          <CardBody className="p-3">
            <div className="flex gap-2">
              <Info className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-foreground/70">
              Your height helps me calculate your BMI and determine appropriate fitness goals for your personal journey.
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default HeightStep;