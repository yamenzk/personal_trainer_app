// src/pages/Login.tsx
import { useState } from 'react';
import { Input, Button } from "@nextui-org/react";
import { motion } from "framer-motion";
import { Key, Mail } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { GlassCard } from '@/components/shared/GlassCard';

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
      {/* Background Elements */}
      <div className="fixed inset-0 -z-10">
        {/* Primary gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-400/20 via-background to-secondary-400/20 animate-gradient-xy" />
        
        {/* Animated gradient orbs */}
        <div 
          className="absolute -top-[40vh] -right-[40vh] w-[80vh] h-[80vh] rounded-full 
            bg-primary-500/30 blur-3xl animate-float"
          style={{ animationDelay: "-2s" }}
        />
        <div 
          className="absolute -bottom-[40vh] -left-[40vh] w-[80vh] h-[80vh] rounded-full 
            bg-secondary-500/30 blur-3xl animate-float"
          style={{ animationDelay: "-1s" }}
        />
        
        {/* Subtle pattern overlay */}
        <div 
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        
        {/* Final overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
      </div>

      <div className="w-full max-w-md space-y-8 relative">
        {/* Logo and Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="flex justify-center mb-6">
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
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-secondary-500 group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute inset-0 bg-black/10" />
              <span className="relative text-5xl font-bold text-white drop-shadow-lg">
                bS
              </span>
            </motion.div>
          </div>
          
          <motion.h1 
            className="text-4xl font-bold mb-2"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <span className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
              byShujaa
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-foreground/60"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Enter your membership ID to access your personal training dashboard
          </motion.p>
        </motion.div>

        {/* Login Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <GlassCard className="p-6 space-y-6">
            <Input
              key="inside"
              label="Membership ID"
              labelPlacement="inside"
              value={membershipId}
              onValueChange={setMembershipId}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              errorMessage={error}
              isInvalid={!!error}
              startContent={<Key className="text-default-400" size={18} />}
              variant="bordered"
              size="lg"
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
              autoFocus
            />
            
            <Button
              color="primary"
              onClick={handleLogin}
              isLoading={isLoading}
              className={`
                w-full bg-gradient-to-r from-primary-500 to-secondary-500 
                shadow-lg hover:shadow-primary-500/25 transition-all duration-300
                hover:-translate-y-0.5 active:translate-y-0 mt-2
                ${isLoading ? 'animate-pulse' : ''}
              `}
              size="lg"
              startContent={!isLoading && <Key size={18} />}
            >
              {isLoading ? 'Verifying...' : 'Continue'}
            </Button>
          </GlassCard>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center space-y-2"
        >
          <p className="text-sm text-foreground/60">
            Need a membership?{' '}
            <a 
              href="mailto:laith@byshujaa.com" 
              className="text-primary-500 hover:text-primary-400 transition-colors inline-flex items-center gap-1"
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