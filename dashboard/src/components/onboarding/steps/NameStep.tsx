// src/components/onboarding/steps/NameStep.tsx
import { useState, useEffect } from 'react';
import { Input, Avatar } from "@nextui-org/react";
import { User } from 'lucide-react';

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
    
    // Validate and update state
    const valid = validateName(formattedName);
    setIsValid(valid);
    
    // Notify parent of validation state
    onValidationChange?.(valid);
    
    // If valid, update the parent's form data
    if (valid) {
      onComplete(formattedName.trim());
    }
  };

  // Initial validation on mount if there's an initial value
  useEffect(() => {
    if (initialValue) {
      handleChange(initialValue);
    }
  }, [initialValue]);

  return (
    <div className="space-y-6">
      {/* Name Preview Avatar */}
      <div className="flex flex-col items-center gap-4 mb-8">
      <div className="w-20 h-20 rounded-full bg-primary-500/10 flex items-center justify-center">
          <User className="w-8 h-8 text-primary-500" />
        </div>
        {name && !error && (
          <p className="text-sm text-foreground/60">
            This is how your name will appear
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
        color="primary"
        radius="lg"
        classNames={{
          input: "text-base",
          inputWrapper: "border-2",
        }}
        description="Please enter your first and last name"
        autoFocus
      />

      {/* Help Text */}
      <div className="bg-content2 rounded-xl p-4 space-y-2">
        <p className="text-sm text-foreground/70">
          Your name should follow these guidelines:
        </p>
        <ul className="text-sm text-foreground/60 space-y-2">
          <li className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
            Include both first and last name
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
            Use only letters, hyphens, and apostrophes
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
            Each name should be at least 2 characters
          </li>
        </ul>
      </div>
    </div>
  );
};

export default NameStep;