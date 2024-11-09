// src/components/onboarding/steps/EmailStep.tsx
import { useState, useEffect } from 'react';
import { Input, Chip } from "@nextui-org/react";
import { Mail, Bell, Shield, ChartBarIcon, MailIcon, Info } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useStepValidation } from '@/hooks/useStepValidation';

interface EmailStepProps {
  onComplete: (value: string) => void;
  onValidationChange?: (isValid: boolean) => void;
  initialValue?: string;
}

const EmailStep = ({ onComplete, onValidationChange, initialValue = '' }: EmailStepProps) => {
  const [email, setEmail] = useState(initialValue);
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    if (!email) {
      setError('Please enter your email address');
      return false;
    }

    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }

    setError('');
    return true;
  };

  const handleChange = (value: string) => {
    setEmail(value);
    const isValid = validateEmail(value);
    onValidationChange?.(isValid);
    if (isValid) {
      onComplete(value);
    }
  };

  const features = [
    { icon: Bell, color: 'primary', label: 'Progress Updates' },
    { icon: ChartBarIcon, color: 'success', label: 'Weekly Reports' },
    { icon: Shield, color: 'secondary', label: 'Account Security' },
  ] as const;

  return (
    <div className="space-y-4">
     

      {/* Email Input */}
      <Input
        type="email"
        label="Email Address"
        value={email}
        onValueChange={handleChange}
        errorMessage={error}
        isInvalid={!!error}
        variant="bordered"
        radius="lg"
        autoFocus
        startContent={
          <Mail className="w-4 h-4 text-foreground/50" />
        }
      />

      {/* Features */}
      <div className="grid grid-cols-3 gap-2">
        {features.map(({ icon: Icon, color, label }) => (
          <div
            key={label}
            className={cn(
              "p-2 rounded-lg bg-content1",
              email && !error && `bg-${color}-500/10`
            )}
          >
            <div className="flex flex-col items-center gap-2 text-center">
              <Icon 
                className={cn(
                  "w-4 h-4",
                  email && !error ? `text-${color}-500` : "text-foreground/50"
                )} 
              />
              <span className="text-xs text-foreground/60">{label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Privacy Note */}
      {email && !error && (
        <div className="bg-primary-500/5 rounded-lg p-3">
          <div className="flex gap-2 items-start">
            <Shield className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-foreground/70">
              Your email is kept private and used only for essential communications.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailStep;