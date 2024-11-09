// src/components/onboarding/steps/EmailStep.tsx
import { useState, useEffect } from 'react';
import { Input, Chip } from "@nextui-org/react";
import { Mail, Bell, Shield, ChartBarIcon, MailIcon } from 'lucide-react';
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
  const { handleSelect } = useStepValidation<string>(initialValue, onComplete, onValidationChange);

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
    const isValid = true;
    if (isValid) {
      handleSelect(email);
    }
    return isValid;
  };

  const handleChange = (value: string) => {
    setEmail(value);
    const isValid = validateEmail(value);
    onValidationChange?.(isValid);
    if (isValid) {
      onComplete(value);
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
      {/* Email Input with Verification UI */}
      <div className="space-y-2">
        <Input
          type="email"
          label="Email Address"
          value={email}
          onValueChange={handleChange}
          errorMessage={error}
          isInvalid={!!error}
          variant="bordered"
          color="primary"
          radius="lg"
          autoFocus
          description="I'll send important updates here"
          classNames={{
            input: "text-base",
            inputWrapper: "border-2",
          }}
        />
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary-500/10 flex items-center justify-center">
              <Bell size={16} className="text-primary-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Progress Updates</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-success-500/10 flex items-center justify-center">
              <ChartBarIcon size={16} className="text-success-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Weekly Reports</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-secondary-500/10 flex items-center justify-center">
              <Shield size={16} className="text-secondary-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Account Security</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Chip
              size="sm"
              variant="solid"
              color="primary"
              startContent={<Shield className="w-3 h-3" />}
            >
              Privacy Protected
            </Chip>
          </div>
        </div>
      </div>

      {/* Privacy Note */}
      <div className="bg-content2 rounded-lg p-3">
        <div className="flex gap-2 items-start">
          <Shield className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-foreground/70">
            Your email is kept private and used only for essential communications like progress updates, 
            security notifications, and account recovery.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailStep;