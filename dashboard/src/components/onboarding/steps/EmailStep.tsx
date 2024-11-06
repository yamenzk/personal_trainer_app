import { useState } from 'react';
import { Input, Button, Tooltip } from "@nextui-org/react";
import { motion } from "framer-motion";
import { Mail, AlertCircle, Bell, Shield, ChevronRight } from 'lucide-react';
import { cn } from '@/utils/cn';

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

  const features = [
    {
      icon: Bell,
      title: 'Progress Updates',
      description: 'Get notified about your achievements and milestones',
      color: 'primary'
    },
    {
      icon: Shield,
      title: 'Account Security',
      description: 'Password recovery and account protection',
      color: 'success'
    },
    {
      icon: Mail,
      title: 'Weekly Reports',
      description: 'Receive detailed progress summaries and insights',
      color: 'secondary'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Input Group */}
      <div className="space-y-4">
        <Input
          type="email"
          label="Email Address"
          value={email}
          variant="underlined"
          color="primary"
          onValueChange={(value) => {
            setEmail(value);
            setError('');
          }}
          errorMessage={error}
          isInvalid={!!error}
          startContent={<Mail className="text-default-400" size={18} />}
        />

        {/* Compact Features List */}
        <div className="space-y-2">
          {features.map(({ icon: Icon, title, description, color }) => (
            <Tooltip 
              key={title}
              content={description}
              placement="right"
              delay={0}
              closeDelay={0}
            >
              <motion.div
                className={cn(
                  "p-2 rounded-lg transition-all duration-200",
                  `hover:bg-${color}-500/5 group cursor-pointer`
                )}
                whileHover={{ x: 4 }}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-200",
                    `bg-${color}-500/10 group-hover:bg-${color}-500/20`
                  )}>
                    <Icon className={`w-4 h-4 text-${color}-500`} />
                  </div>
                  <div className="flex-1 flex items-center justify-between">
                    <span className="font-medium text-sm">{title}</span>
                    <ChevronRight 
                      size={16} 
                      className={cn(
                        "opacity-0 transition-all duration-200",
                        "group-hover:opacity-100",
                        `text-${color}-500`
                      )} 
                    />
                  </div>
                </div>
              </motion.div>
            </Tooltip>
          ))}
        </div>

        {/* Compact Privacy Note */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary-500/5 text-xs text-foreground/70">
          <Shield className="w-4 h-4 text-primary-500 flex-shrink-0" />
          Your email is private and only used for essential notifications
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

export default EmailStep;