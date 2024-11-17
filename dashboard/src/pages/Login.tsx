// src/pages/Login.tsx
import { useState, useEffect } from 'react';
import { Input, Button, Card, CardBody, Chip } from "@nextui-org/react";
import { Key, Mail, Clock, LoaderCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';

const MAX_RECENT_IDS = 3;

// Add Snow component at the top of the file
const Snow = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {Array.from({ length: 50 }).map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-2 h-2 bg-white/20 rounded-full"
        animate={{
          y: ['0vh', '100vh'],
          x: [
            `${Math.random() * 100}vw`,
            `${Math.random() * 100 + (Math.random() - 0.5) * 20}vw`
          ],
          opacity: [1, 0],
          scale: [Math.random() * 0.5 + 0.5, 0]
        }}
        transition={{
          duration: Math.random() * 5 + 5,
          repeat: Infinity,
          ease: "linear",
          delay: Math.random() * 5
        }}
        style={{
          left: `${Math.random() * 100}%`,
          top: `-${Math.random() * 20}%`,
        }}
      />
    ))}
  </div>
);

// Add this interface near the top of the file, after imports
interface LoginError {
  message: string;
}

const Login = () => {
  const [membershipId, setMembershipId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const { login } = useAuth();

  // Load recent membership IDs on mount
  useEffect(() => {
    const stored = localStorage.getItem('recentMembershipIds');
    if (stored) {
      setRecentIds(JSON.parse(stored));
    }
  }, []);

  const handleLogin = async (id: string = membershipId) => {
    if (!id.trim()) {
      setError('Please enter your membership ID');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      await login(id);
      // Only update recent IDs if login was successful
      const updatedIds = [id, ...recentIds.filter(rid => rid !== id)]
        .slice(0, MAX_RECENT_IDS);
      localStorage.setItem('recentMembershipIds', JSON.stringify(updatedIds));
    } catch (err: unknown) {
      const error = err as LoginError;
      // Show the error message from the server
      setError(error.message || 'Invalid membership ID. Please try again.');
    } finally {
      setIsLoading(false); // Move this to finally block
    }
  };

  const removeRecentId = (id: string) => {
    const updatedIds = recentIds.filter(rid => rid !== id);
    setRecentIds(updatedIds);
    localStorage.setItem('recentMembershipIds', JSON.stringify(updatedIds));
  };

  return (
    <div className="min-h-screen w-full flex md:flex-row flex-col relative">
      {/* Left Panel - Hero Section */}
      <div className="flex-1 bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-900 relative overflow-hidden flex items-center min-h-[308px] max-h-[308px] md:min-h-screen md:max-h-screen">
        {/* Snow animation */}
        <Snow />
        
        {/* Existing background layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-secondary-500/10" />

        {/* Content */}
        <div className="relative h-full flex flex-col items-center justify-center p-4 text-white w-full">
          <motion.img
            src="/assets/personal_trainer_app/dashboard/logo.png"
            alt="byShujaa"
            className="w-64 h-32 object-contain mb-2"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", duration: 1 }}
          />
          {/* <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-4 text-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Welcome to byShujaa
          </motion.h1> */}
          <motion.p 
            className="text-md text-white/80 text-center max-w-md"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Winter Season, the perfect time to start your fitness journey. ❄️ Use code 'WINTER10' to enjoy 10 days for free!
          </motion.p>
        </div>
      </div>

      {/* Snow Pile Overlay */}
      <div className="absolute left-0 right-0 h-24 pointer-events-none z-10">
        {/* For mobile */}
        <div className="md:hidden">
          <img 
            src="/assets/personal_trainer_app/dashboard/snow.png" 
            alt=""
            className="absolute top-[270px] left-0 w-full h-24 object-cover"
          />
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background relative">
        <motion.div 
          className="w-full max-w-md space-y-8"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-bold">Sign In</h2>
            <p className="text-foreground-500">Enter your membership ID to continue</p>
          </div>

          <Card className="bg-content1/50 backdrop-blur-lg border border-content1">
            <CardBody className="gap-6 p-6">
              {recentIds.length > 0 && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  className="space-y-3"
                >
                  <p className="text-sm text-foreground/60 flex items-center gap-2">
                    <Clock size={14} className="text-primary" />
                    <span className="font-medium">Recent Logins</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {recentIds.map((id) => (
                      <Chip
                        key={id}
                        variant="flat"
                        onClose={() => removeRecentId(id)}
                        onClick={() => handleLogin(id)}
                        className="cursor-pointer hover:bg-primary/10 border border-primary/20"
                        classNames={{
                          base: "transition-all duration-200",
                          content: "font-medium",
                        }}
                      >
                        {id}
                      </Chip>
                    ))}
                  </div>
                </motion.div>
              )}

              <Input
                label="Membership ID"
                value={membershipId}
                onValueChange={setMembershipId}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                errorMessage={error}
                isInvalid={!!error}
                startContent={<Key className="text-primary" size={18} />}
                variant="bordered"
                classNames={{
                  label: "font-medium",
                  input: "font-medium",
                  inputWrapper: [
                    "bg-content1/50",
                    "backdrop-blur-xl",
                    "!cursor-text",
                    "border-2",
                  ],
                }}
                autoFocus
              />

              <Button
                color="primary"
                onClick={() => handleLogin()}
                isLoading={isLoading}
                className="w-full font-medium"
                size="lg"
                startContent={!isLoading && <Key size={18} />}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <LoaderCircle className="animate-spin" size={18} />
                    Signing in...
                  </div>
                ) : (
                  "Continue"
                )}
              </Button>
            </CardBody>
          </Card>

          <p className="text-center text-sm text-foreground/60">
            Need a membership?{' '}
            <a 
              href="mailto:laith@byshujaa.com"
              className="text-primary hover:underline inline-flex items-center gap-1"
            >
              Contact me <Mail size={14} />
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;