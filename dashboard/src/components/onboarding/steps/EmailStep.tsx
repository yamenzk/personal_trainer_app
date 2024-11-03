// src/components/onboarding/steps/EmailStep.tsx
import { useState } from 'react';
import { Card, Input, Button } from "@nextui-org/react";
import { motion } from "framer-motion";
import { Mail } from 'lucide-react';
import { EmailStepProps } from '../../../types/onboarding';

const EmailStep: React.FC<EmailStepProps> = ({ onComplete }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    onComplete(email);
  };

  return (
    <Card className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold">What's your email?</h2>
          <p className="text-sm text-foreground/60">
            We'll use this to keep you updated on your progress and important notifications
          </p>
        </div>

        <Input
          type="email"
          label="Email address"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError('');
          }}
          errorMessage={error}
          isInvalid={!!error}
          startContent={<Mail className="text-default-400" size={20} />}
        />

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

export default EmailStep;