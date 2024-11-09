// src/components/onboarding/steps/NameStep.tsx
import { useState, useEffect } from 'react';
import { Input, Card } from "@nextui-org/react";
import { User, Mail, Bell, Shield, ChartBarIcon, Info, Check } from 'lucide-react';
import { cn } from '@/utils/cn';

interface NameStepProps {
  onComplete: (value: string) => void;
  // Add isValid prop to control parent's button state
  onValidationChange?: (isValid: boolean) => void;
  initialValue?: string;
}

const NameStep = ({ onComplete, onValidationChange, initialValue = '' }: NameStepProps) => {
  const [name, setName] = useState(initialValue);
  const [error, setError] = useState('');
  const [isValid, setIsValid] = useState(false);

  const validateName = (value: string) => {
    const trimmedValue = value.trim();
    if (!trimmedValue) {
      setError('Please enter your name');
      return false;
    }
    const words = trimmedValue.split(/\s+/);
    if (words.length < 2) {
      setError('Please enter both your first and last name');
      return false;
    }
    if (words.some(word => word.length < 2)) {
      setError('Each name should be at least 2 characters long');
      return false;
    }
    if (words.some(word => !/^[a-zA-Z\-\']+$/.test(word))) {
      setError('Names should only contain letters, hyphens, and apostrophes');
      return false;
    }
    setError('');
    return true;
  };

  const formatName = (value: string) => {
    return value
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleChange = (value: string) => {
    const formattedName = formatName(value);
    setName(formattedName);
    const valid = validateName(formattedName);
    setIsValid(valid);
    onValidationChange?.(valid);
    if (valid) {
      onComplete(formattedName.trim());
    }
  };

  useEffect(() => {
    if (initialValue) {
      handleChange(initialValue);
    }
  }, [initialValue]);

  return (
    <div className="space-y-4">

      {/* Name Preview */}
      <div className="flex flex-col items-center py-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-gradient-to-b from-primary-500/20 to-background flex items-center justify-center">
            {isValid ? (
              <span className="text-xl font-semibold text-primary-500">
                {name.split(' ').map(n => n[0]).join('')}
              </span>
            ) : (
              <User className="w-6 h-6 text-primary-500" />
            )}
          </div>
          {isValid && (
            <div className="absolute -right-1 -bottom-1 w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center">
              <Check className="w-4 h-4 text-white" />
            </div>
          )}
        </div>
        {name && !error && (
          <p className="text-sm text-foreground/60 mt-3">
            {name}
          </p>
        )}
      </div>

      {/* Name Input */}
      <Input
        type="text"
        label="Full Name"
        value={name}
        onValueChange={handleChange}
        errorMessage={error}
        isInvalid={!!error}
        variant="bordered"
        radius="lg"
        autoFocus
        startContent={
          <User className="w-4 h-4 text-foreground/50" />
        }
      />
    </div>
  );
};

export default NameStep;