// src/components/onboarding/steps/HeightStep.tsx
import { useState } from 'react';
import { Input, Button, Select, SelectItem } from "@nextui-org/react";
import { motion } from "framer-motion";
import { Ruler, AlertCircle } from 'lucide-react';

interface HeightStepProps {
  onComplete: (value: number) => void;
  isLoading?: boolean;
}

const HeightStep = ({ onComplete, isLoading = false }: HeightStepProps) => {
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
      const feet = parseFloat(height);
      const inchesValue = parseFloat(inches || '0');
      if (feet < 3 || feet > 8 || inchesValue < 0 || inchesValue >= 12) {
        setError('Please enter a valid height');
        return;
      }
      heightInCm = (feet * 30.48) + (inchesValue * 2.54);
    }

    onComplete(heightInCm);
  };

  // Height categories for reference
  // const heightCategories = [
  //   { label: 'Below Average', range: unit === 'cm' ? '< 165' : '< 5\'5"' },
  //   { label: 'Average', range: unit === 'cm' ? '165-175' : '5\'5" - 5\'9"' },
  //   { label: 'Above Average', range: unit === 'cm' ? '> 175' : '> 5\'9"' },
  // ];

  return (
    <div className="space-y-8">
      {/* Height Input */}
      <div className="flex gap-4">
        {unit === 'cm' ? (
          <Input
            type="number"
            label="Height"
            value={height}
            onValueChange={setHeight}
            errorMessage={error}
            isInvalid={!!error}
            startContent={<Ruler className="text-default-400" size={18} />}
            endContent={<span className="text-default-400">cm</span>}
            classNames={{
              label: "text-foreground/90",
              input: ["bg-transparent", "text-foreground/90"],
              innerWrapper: "bg-transparent",
              inputWrapper: [
                "bg-content/10",
                "backdrop-blur-sm",
                "hover:bg-content/20",
                "group-data-[focused=true]:bg-content/20",
              ],
            }}
          />
        ) : (
          <div className="flex gap-2 flex-1">
            <Input
              type="number"
              label="Feet"
              value={height}
              onValueChange={setHeight}
              startContent={<Ruler className="text-default-400" size={18} />}
              endContent={<span className="text-default-400">ft</span>}
              classNames={{
                label: "text-foreground/90",
                input: ["bg-transparent", "text-foreground/90"],
                innerWrapper: "bg-transparent",
                inputWrapper: [
                  "bg-content/10",
                  "backdrop-blur-sm",
                  "hover:bg-content/20",
                  "group-data-[focused=true]:bg-content/20",
                ],
              }}
            />
            <Input
              type="number"
              label="Inches"
              value={inches}
              onValueChange={setInches}
              endContent={<span className="text-default-400">in</span>}
              classNames={{
                label: "text-foreground/90",
                input: ["bg-transparent", "text-foreground/90"],
                innerWrapper: "bg-transparent",
                inputWrapper: [
                  "bg-content/10",
                  "backdrop-blur-sm",
                  "hover:bg-content/20",
                  "group-data-[focused=true]:bg-content/20",
                ],
              }}
            />
          </div>
        )}

        <Select
          label="Unit"
          value={unit}
          defaultSelectedKeys={["cm"]}
          onChange={(e) => {
            setUnit(e.target.value as 'cm' | 'ft');
            setHeight('');
            setInches('');
            setError('');
          }}
          className="w-32"
          classNames={{
            trigger: "bg-content/10 backdrop-blur-sm",
            value: "text-foreground/90",
          }}
        >
          <SelectItem key="cm" value="cm">cm</SelectItem>
          <SelectItem key="ft" value="ft">ft</SelectItem>
        </Select>
      </div>

      {/* Height Categories */}
      {/* <div className="grid grid-cols-3 gap-4">
        {heightCategories.map(({ label, range }) => (
          <div key={label} className="p-4 rounded-xl bg-content/5 text-center space-y-1">
            <p className="text-sm text-foreground/60">{label}</p>
            <p className="font-medium">{range}</p>
          </div>
        ))}
      </div> */}

      {/* BMI Info */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-primary-500/5">
        <AlertCircle className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
        <div className="space-y-2">
          <p className="text-sm text-foreground/70">
            Your height will be used to calculate your BMI (Body Mass Index) and determine healthy weight ranges for your body type.
          </p>
          {/* <div className="flex flex-wrap gap-2">
            {[
              { label: 'Underweight', value: '< 18.5' },
              { label: 'Normal', value: '18.5-24.9' },
              { label: 'Overweight', value: '> 25' }
            ].map(({ label, value }) => (
              <div key={label} className="px-2 py-1 rounded-lg bg-content/10 text-xs">
                <span className="font-medium">{label}:</span> {value}
              </div>
            ))}
          </div> */}
        </div>
      </div>

      {/* Submit Button */}
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

export default HeightStep;