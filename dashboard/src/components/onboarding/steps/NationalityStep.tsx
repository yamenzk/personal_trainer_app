// src/components/onboarding/steps/NationalityStep.tsx
import { useState } from 'react';
import { Card, Button, Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { motion } from "framer-motion";
import { Globe } from 'lucide-react';
import { NationalityStepProps } from '../../../types/onboarding';
import countries from '../../../data/countries';

const NationalityStep: React.FC<NationalityStepProps> = ({ onComplete }) => {
  const [nationality, setNationality] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!nationality) {
      setError('Please select your nationality');
      return;
    }

    onComplete(nationality);
  };

  return (
    <Card className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold">What's your nationality?</h2>
          <p className="text-sm text-foreground/60">
            This helps us personalize your experience and provide relevant content
          </p>
        </div>

        <Autocomplete
          label="Select your nationality"
          placeholder="Start typing..."
          defaultItems={countries}
          startContent={<Globe className="text-default-400" size={20} />}
          errorMessage={error}
          isInvalid={!!error}
          onSelectionChange={(value) => {
            setNationality(value as string);
            setError('');
          }}
        >
          {(country) => (
            <AutocompleteItem key={country.code} value={country.name}>
              {country.name}
            </AutocompleteItem>
          )}
        </Autocomplete>

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

export default NationalityStep;