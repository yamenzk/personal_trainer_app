// src/components/onboarding/steps/NameStep.tsx
import { useState } from 'react';
import { Input, Button } from "@nextui-org/react";
import { motion } from "framer-motion";
import { User, AlertCircle, Smile } from 'lucide-react';

interface NameStepProps {
  onComplete: (value: string) => void;
  isLoading?: boolean;
}

const NameStep = ({ onComplete, isLoading = false }: NameStepProps) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const validateName = (name: string) => {
    // At least 2 words (first and last name)
    const words = name.trim().split(/\s+/);
    return words.length >= 2 && words.every(word => word.length >= 2);
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    if (!validateName(name)) {
      setError('Please enter your full name (first and last name)');
      return;
    }

    onComplete(name.trim());
  };

  const formatName = (name: string) => {
    return name
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="space-y-8">
      {/* Name Input */}
      <div className="space-y-6">
        {/* Welcome Image */}
        <div className="flex justify-center">
          <motion.div
            className="w-16 h-16 rounded-full bg-primary-500/10 flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <Smile className="w-8 h-8 text-primary-500" />
          </motion.div>
        </div>

        <Input
          type="text"
          label="Full Name"
          value={name}
          onValueChange={(value) => {
            setName(formatName(value));
            setError('');
          }}
          errorMessage={error}
          isInvalid={!!error}
          startContent={<User className="text-default-400" size={18} />}
          description="Enter your first and last name"
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

        {/* Name Preview */}
        {name && !error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-primary-500/5 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-primary-500" />
              <span className="font-medium">{name}</span>
            </div>
            <span className="text-xs text-foreground/60">Preview</span>
          </motion.div>
        )}
      </div>

      {/* Info Box */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-primary-500/5">
        <AlertCircle className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
        <div className="space-y-2">
          <p className="text-sm text-foreground/70">
            Enter your full name as you'd like it to appear in the app. This helps me personalize your experience and provide better support.
          </p>
          <ul className="text-sm text-foreground/60 space-y-1">
            <li className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-primary-500" />
              Use your real name for accurate identification
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-primary-500" />
              Include both first and last name
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-primary-500" />
              Proper capitalization will be handled automatically
            </li>
          </ul>
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

export default NameStep;