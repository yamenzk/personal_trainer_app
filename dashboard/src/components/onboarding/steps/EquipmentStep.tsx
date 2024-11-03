// src/components/onboarding/steps/EquipmentStep.tsx
import { useState } from 'react';
import { Card, Button, RadioGroup, Radio } from "@nextui-org/react";
import { motion } from "framer-motion";
import { Dumbbell, Home } from 'lucide-react';

interface EquipmentStepProps {
  onComplete: (equipment: string) => void;
}

const EquipmentStep = ({ onComplete }: EquipmentStepProps) => {
  const [equipment, setEquipment] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!equipment) {
      setError('Please select your preferred workout location');
      return;
    }
    onComplete(equipment);
  };

  return (
    <Card className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold">Where will you work out?</h2>
          <p className="text-sm text-foreground/60">
            We'll customize your workout plan based on available equipment
          </p>
        </div>

        <RadioGroup
          value={equipment}
          onValueChange={setEquipment}
          classNames={{
            wrapper: "gap-4"
          }}
          orientation="vertical"
          isInvalid={!!error}
          errorMessage={error}
        >
          <Radio value="Gym">
            <div className="flex items-center gap-3">
              <Dumbbell className="w-5 h-5" />
              <div className="flex flex-col">
                <span className="text-base">Gym</span>
                <span className="text-xs text-foreground/60">Access to full gym equipment</span>
              </div>
            </div>
          </Radio>
          <Radio value="Home">
            <div className="flex items-center gap-3">
              <Home className="w-5 h-5" />
              <div className="flex flex-col">
                <span className="text-base">Home</span>
                <span className="text-xs text-foreground/60">Minimal equipment needed</span>
              </div>
            </div>
          </Radio>
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

export default EquipmentStep;