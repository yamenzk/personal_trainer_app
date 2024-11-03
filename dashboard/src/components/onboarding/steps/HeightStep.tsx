// src/components/onboarding/steps/HeightStep.tsx
import { useState } from 'react';
import { Card, Input, Button, Select, SelectItem } from "@nextui-org/react";
import { motion } from "framer-motion";
import { Ruler } from 'lucide-react';
import { HeightStepProps } from '../../../types/onboarding';

const HeightStep: React.FC<HeightStepProps> = ({ onComplete }) => {
  const [unit, setUnit] = useState<'cm' | 'ft'>('cm');
  const [height, setHeight] = useState('');
  const [inches, setInches] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!height) {
      setError('Please enter your height');
      return;
    }
    
    let heightInCm: number;
    
    if (unit === 'cm') {
      heightInCm = parseFloat(height);
      if (heightInCm < 100 || heightInCm > 250) {
        setError('Please enter a valid height between 100cm and 250cm');
        return;
      }
    } else {
      // Convert feet and inches to cm
      const feet = parseFloat(height);
      const inchesValue = parseFloat(inches || '0');
      if (feet < 3 || feet > 8 || inchesValue < 0 || inchesValue >= 12) {
        setError('Please enter a valid height');
        return;
      }
      heightInCm = (feet * 30.48) + (inchesValue * 2.54);
    }
    
    onComplete(Math.round(heightInCm));
  };

  return (
    <Card className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold">What's your height?</h2>
          <p className="text-sm text-foreground/60">
            We'll use this to calculate your ideal measurements and create personalized plans
          </p>
        </div>

        <div className="space-y-4">
          <Select
            label="Unit"
            value={unit}
            onChange={(e) => {
              setUnit(e.target.value as 'cm' | 'ft');
              setHeight('');
              setInches('');
              setError('');
            }}
          >
            <SelectItem key="cm" value="cm">Centimeters (cm)</SelectItem>
            <SelectItem key="ft" value="ft">Feet and inches (ft)</SelectItem>
          </Select>

          {unit === 'cm' ? (
            <Input
              type="number"
              label="Height"
              placeholder="Enter your height in centimeters"
              value={height}
              onChange={(e) => {
                setHeight(e.target.value);
                setError('');
              }}
              startContent={<Ruler className="text-default-400" size={20} />}
              endContent={<div className="pointer-events-none text-foreground/50">cm</div>}
              errorMessage={error}
              isInvalid={!!error}
            />
          ) : (
            <div className="flex gap-2">
              <Input
                type="number"
                label="Feet"
                placeholder="5"
                value={height}
                onChange={(e) => {
                  setHeight(e.target.value);
                  setError('');
                }}
                startContent={<Ruler className="text-default-400" size={20} />}
                endContent={<div className="pointer-events-none text-foreground/50">ft</div>}
                errorMessage={error}
                isInvalid={!!error}
              />
              <Input
                type="number"
                label="Inches"
                placeholder="10"
                value={inches}
                onChange={(e) => {
                  setInches(e.target.value);
                  setError('');
                }}
                endContent={<div className="pointer-events-none text-foreground/50">in</div>}
              />
            </div>
          )}
        </div>

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

export default HeightStep;