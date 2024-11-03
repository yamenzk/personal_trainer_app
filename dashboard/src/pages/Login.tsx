// src/pages/Login.tsx
import { useState } from 'react';
import { Card, Input, Button } from "@nextui-org/react";
import { motion } from "framer-motion";
import { Key } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [membershipId, setMembershipId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!membershipId.trim()) {
      setError('Please enter your membership ID');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      await login(membershipId);
    } catch (err) {
      setError('Invalid membership ID. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-gray-900">
      {/* Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-background to-secondary/40" />
        <div className="absolute -top-[40vh] -right-[40vh] w-[80vh] h-[80vh] rounded-full bg-primary/30 blur-3xl" />
        <div className="absolute -bottom-[40vh] -left-[40vh] w-[80vh] h-[80vh] rounded-full bg-secondary/30 blur-3xl" />
      </div>

      {/* Content */}
      <div className="w-full max-w-md space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center text-white"
        >
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 bg-primary/30 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-5xl font-bold bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent">
                  bS
                </span>
              </div>
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-background px-4 py-2 rounded-full border border-border shadow-sm">
                <span className="text-sm font-semibold text-foreground">Fitness</span>
              </div>
            </div>
          </div>
          <h1 className="text-5xl font-extrabold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            byShujaa
          </h1>
          <p className="text-foreground/80 max-w-sm mx-auto">
            Enter your membership ID to access your personalized training dashboard
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="p-6 space-y-6 backdrop-blur-xl bg-background/80 shadow-xl">
            <Input
              label="Membership ID"
              placeholder="Enter your membership ID"
              value={membershipId}
              onChange={(e) => {
                setMembershipId(e.target.value);
                setError('');
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              errorMessage={error}
              isInvalid={!!error}
              startContent={<Key className="text-default-400" size={18} />}
              size="lg"
              autoFocus
              className="border-primary/60"
            />
            
            <Button
              color="primary"
              onClick={handleLogin}
              isLoading={isLoading}
              className="w-full"
              size="lg"
              startContent={!isLoading && <Key size={18} />}
            >
              {isLoading ? 'Logging in...' : 'Continue'}
            </Button>
          </Card>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center text-sm text-foreground/80"
        >
          Don't have a membership ID? Contact me.
        </motion.p>
      </div>
    </div>
  );
};

export default Login;
