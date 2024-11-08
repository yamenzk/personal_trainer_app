// src/components/onboarding/steps/NameStep.tsx
import { useState } from 'react';
import { Input, Avatar } from "@nextui-org/react";
import { User } from 'lucide-react';

interface NameStepProps {
  onComplete: (value: string) => void;
}

const NameStep = ({ onComplete }: NameStepProps) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const validateName = (name: string) => {
    const words = name.trim().split(/\s+/);
    return words.length >= 2 && words.every(word => word.length >= 2);
  };

  const formatName = (name: string) => {
    return name
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleChange = (value: string) => {
    const formattedName = formatName(value);
    setName(formattedName);
    setError('');
    
    if (validateName(formattedName)) {
      onComplete(formattedName);
    }
  };

  return (
    <div className="space-y-6">
      {/* Name Preview Avatar */}
      <div className="flex flex-col items-center gap-4 mb-8">
        <Avatar
          name={name || undefined}
          isBordered
          color="primary"
          showFallback
          size="lg"
          classNames={{
            base: "w-20 h-20 text-large",
            icon: "w-8 h-8",
          }}
          fallback={
            <User className="w-8 h-8 text-default-500" />
          }
        />
        {name && (
          <p className="text-sm text-foreground/60">
            This is how your name will appear
          </p>
        )}
      </div>

      {/* Name Input */}
      <Input
        type="text"
        label="Full Name"
        placeholder="Enter your full name"
        value={name}
        onValueChange={handleChange}
        errorMessage={error}
        isInvalid={!!error}
        variant="bordered"
        radius="lg"
        classNames={{
          input: "text-base",
          inputWrapper: "border-2",
        }}
        description="Please enter your first and last name"
      />

      {/* Help Text */}
      <div className="bg-content2 rounded-xl p-4 space-y-2">
        <p className="text-sm text-foreground/70">
          Enter your full name as you'd like it to appear in the app:
        </p>
        <ul className="text-sm text-foreground/60 space-y-2">
          <li className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
            Use your real name for accurate identification
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
            Include both first and last name
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
            Proper capitalization will be handled automatically
          </li>
        </ul>
      </div>
    </div>
  );
};

export default NameStep;