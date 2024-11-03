import { useState } from 'react';
import { Card, Input, Button, Link } from "@nextui-org/react";
import { motion, AnimatePresence } from "framer-motion";
import { Key, Mail } from 'lucide-react';
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
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden bg-background">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-400/20 via-background to-secondary-400/20 animate-gradient-xy" />
        <div 
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        
        {/* Animated gradient orbs */}
        <div className="absolute -top-[40vh] -right-[40vh] w-[80vh] h-[80vh] rounded-full bg-primary-500/30 blur-3xl animate-pulse" />
        <div className="absolute -bottom-[40vh] -left-[40vh] w-[80vh] h-[80vh] rounded-full bg-secondary-500/30 blur-3xl animate-pulse" />
        
        {/* Additional subtle patterns */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
      </div>

      {/* Content */}
      <div className="w-full max-w-md space-y-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="flex justify-center mb-6">
            <div className="relative">
              <motion.div 
                className="w-24 h-24 rounded-full flex items-center justify-center overflow-hidden relative group"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: 0.1
                }}
              >
                {/* Gradient background with hover effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-secondary-500 group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-black/10" />
                
                {/* Logo text */}
                <span className="relative text-5xl font-bold text-white drop-shadow-lg">
                  bS
                </span>
              </motion.div>

              {/* Badge */}
              <motion.div 
                className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-content/80 backdrop-blur-md px-4 py-2 rounded-full border border-border shadow-lg"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <span className="text-sm font-semibold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
                  Fitness
                </span>
              </motion.div>
            </div>
          </div>
          
          {/* Main title */}
          <motion.h1 
            className="text-5xl font-bold mb-2"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <span className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
              byShujaa
            </span>
          </motion.h1>
          
          {/* Subtitle */}
          <motion.p 
            className="text-foreground/60 max-w-sm mx-auto"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Enter your membership ID to access your personalized training dashboard
          </motion.p>
        </motion.div>

        {/* Login Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6 space-y-6 bg-content/80 backdrop-blur-xl border border-border shadow-xl">
            {/* Input field with error handling */}
            <AnimatePresence mode="wait">
              <motion.div
                key={error ? 'error' : 'input'}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
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
                  classNames={{
                    input: "bg-transparent",
                    inputWrapper: [
                      "backdrop-blur-xl",
                      "bg-content/50",
                      "shadow-inner",
                      "hover:bg-content/60",
                      "transition-background",
                      "duration-150",
                      "group-data-[focused=true]:bg-content/70",
                    ].join(" "),
                  }}
                />
              </motion.div>
            </AnimatePresence>
            
            {/* Login button with loading state */}
            <Button
              color="primary"
              onClick={handleLogin}
              isLoading={isLoading}
              className={`
                w-full bg-gradient-to-r from-primary-500 to-secondary-500 
                shadow-lg hover:shadow-primary-500/25 transition-all duration-300
                hover:-translate-y-0.5 active:translate-y-0
                ${isLoading ? 'animate-pulse' : ''}
              `}
              size="lg"
              startContent={!isLoading && <Key size={18} />}
            >
              {isLoading ? 'Logging in...' : 'Continue'}
            </Button>
          </Card>
        </motion.div>

        {/* Footer links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center space-y-2"
        >
          <p className="text-sm text-foreground/60">
            Don't have a membership ID?{' '}
            <Link 
              href="mailto:contact@byshujaa.com" 
              className="text-primary-500 hover:text-primary-400 transition-colors"
            >
              <span className="inline-flex items-center gap-1">
                Contact us <Mail size={14} />
              </span>
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;