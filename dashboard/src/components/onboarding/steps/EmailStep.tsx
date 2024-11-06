// src/components/onboarding/steps/EmailStep.tsx 
import { useState } from 'react';
import { Input, Button } from "@nextui-org/react";
import { motion } from "framer-motion";
import { Mail, AlertCircle, Bell, Shield } from 'lucide-react';

interface EmailStepProps {
  onComplete: (value: string) => void;
  isLoading?: boolean;
}

const EmailStep = ({ onComplete, isLoading = false }: EmailStepProps) => {
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
    <div className="space-y-8">
      {/* Email Input */}
      <Input
        type="email"
        label="Email Address"
        value={email}
        onValueChange={(value) => {
          setEmail(value);
          setError('');
        }}
        errorMessage={error}
        isInvalid={!!error}
        startContent={<Mail className="text-default-400" size={18} />}
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

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            icon: Bell,
            title: 'Updates',
            description: 'Get progress notifications',
            color: 'primary'
          },
          {
            icon: Shield,
            title: 'Security',
            description: 'Account recovery & backup',
            color: 'success'
          },
          {
            icon: Mail,
            title: 'Reports',
            description: 'Weekly progress summaries',
            color: 'secondary'
          }
        ].map(({ icon: Icon, title, description, color }) => (
          <div 
            key={title}
            className={`p-4 rounded-xl bg-${color}-500/5 space-y-2`}
          >
            <div className={`w-8 h-8 rounded-lg bg-${color}-500/10 flex items-center justify-center`}>
              <Icon className={`w-4 h-4 text-${color}-500`} />
            </div>
            <div>
              <h3 className="font-medium">{title}</h3>
              <p className="text-sm text-foreground/60">{description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Privacy Note */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-primary-500/5">
        <AlertCircle className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-foreground/70">
          Your email is kept private and is only used for important notifications about your fitness journey. We never share your data with third parties.
        </p>
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

export default EmailStep;