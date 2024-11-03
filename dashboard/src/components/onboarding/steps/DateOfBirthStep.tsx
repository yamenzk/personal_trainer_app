// src/components/onboarding/steps/DateOfBirthStep.tsx
import { useState } from 'react';
import { Card, Button } from "@nextui-org/react";
import { motion } from "framer-motion";
import dayjs from 'dayjs';
import { DateOfBirthStepProps } from '../../../types/onboarding';

const DateOfBirthStep: React.FC<DateOfBirthStepProps> = ({ onComplete }) => {
  const [date, setDate] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!date) {
      setError('Please select your date of birth');
      return;
    }

    const birthDate = dayjs(date);
    const age = dayjs().diff(birthDate, 'year');

    if (age < 16 || age > 100) {
      setError('Please enter a valid date of birth. You must be at least 16 years old.');
      return;
    }

    onComplete(birthDate.format('YYYY-MM-DD'));
  };

  return (
    <Card className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold">When were you born?</h2>
          <p className="text-sm text-foreground/60">
            We'll use this to calculate your age and customize your fitness journey
          </p>
        </div>

        <div className="space-y-2">
          <input
            type="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              setError('');
            }}
            max={dayjs().subtract(16, 'year').format('YYYY-MM-DD')}
            className={`w-full px-4 py-2 rounded-lg border ${
              error ? 'border-danger' : 'border-divider'
            } bg-background focus:outline-none focus:ring-2 focus:ring-primary`}
          />
          {error && (
            <p className="text-danger text-sm">{error}</p>
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

export default DateOfBirthStep;