// src/components/onboarding/steps/GenderStep.tsx
import { useState } from 'react'
import { Card, Button, RadioGroup, Radio } from "@nextui-org/react";
import { motion } from "framer-motion";
import { GenderStepProps } from '../../../types/onboarding';

const GenderStep: React.FC<GenderStepProps> = ({ onComplete }) => {
  const [gender, setGender] = useState<'Male' | 'Female' | undefined>();
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!gender) {
      setError('Please select your gender');
      return;
    }
    onComplete(gender);
  };

  return (
    <Card className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold">What's your gender?</h2>
          <p className="text-sm text-foreground/60">
            This helps us calculate your nutritional needs and fitness goals more accurately
          </p>
        </div>

        <RadioGroup
          value={gender}
          onValueChange={(value) => {
            setGender(value as 'Male' | 'Female');
            setError('');
          }}
          isInvalid={!!error}
          errorMessage={error}
        >
          <Radio value="Male">Male</Radio>
          <Radio value="Female">Female</Radio>
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

export default GenderStep;