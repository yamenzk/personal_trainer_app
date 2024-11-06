// src/components/onboarding/steps/DateOfBirthStep.tsx
import { useState } from 'react';
import { Input, Button } from "@nextui-org/react";
import { motion } from "framer-motion";
import { Calendar, AlertCircle } from 'lucide-react';
import dayjs from 'dayjs';

interface DateOfBirthStepProps {
  onComplete: (value: string) => void;
  isLoading?: boolean;
}

const DateOfBirthStep = ({ onComplete, isLoading = false }: DateOfBirthStepProps) => {
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

  const maxDate = dayjs().subtract(16, 'year').format('YYYY-MM-DD');

  return (
    <div className="space-y-8">
      {/* Date Input */}
      <div className="space-y-4">
        <Input
          type="date"
          label="Date of Birth"
          
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
            setError('');
          }}
          max={maxDate}
          startContent={<Calendar className="text-default-400" size={18} />}
          errorMessage={error}
          isInvalid={!!error}
          classNames={{
            label: "text-foreground/90",
            input: [
              "bg-transparent",
              "text-foreground/90",
              "placeholder:text-foreground/50",
            ],
            innerWrapper: "bg-transparent",
            inputWrapper: [
              "shadow-sm",
              "bg-content/10",
              "backdrop-blur-sm",
              "hover:bg-content/20",
              "group-data-[focused=true]:bg-content/20",
              "!cursor-text",
            ],
          }}
        />

        {/* Age Groups */}
        {/* <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Teenager', range: '16-19' },
            { label: 'Young Adult', range: '20-35' },
            { label: 'Adult', range: '36+' },
          ].map(({ label, range }) => (
            <div key={label} className="p-4 rounded-xl bg-content/5 text-center space-y-1">
              <p className="text-sm text-foreground/60">{label}</p>
              <p className="font-medium">{range} years</p>
            </div>
          ))}
        </div> */}

        {/* Info Box */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-primary-500/5">
          <AlertCircle className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-foreground/70">
            Your age helps me create a safe and effective fitness program tailored to your life stage and capabilities.
          </p>
        </div>
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

export default DateOfBirthStep;