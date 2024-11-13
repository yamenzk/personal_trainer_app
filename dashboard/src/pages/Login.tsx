// src/pages/Login.tsx
import { useState, useEffect } from 'react';
import { Input, Button, Card, CardBody, Chip } from "@nextui-org/react";
import { Key, Mail, Clock, Triangle, Circle, Square } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';

const MAX_RECENT_IDS = 3;

const Login = () => {
  const [membershipId, setMembershipId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const { login } = useAuth();
  const { theme } = useTheme();

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
      // Update recent IDs
      const updatedIds = [id, ...recentIds.filter(rid => rid !== id)]
        .slice(0, MAX_RECENT_IDS);
      localStorage.setItem('recentMembershipIds', JSON.stringify(updatedIds));
    } catch (err) {
      setError('Invalid membership ID. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const removeRecentId = (id: string) => {
    const updatedIds = recentIds.filter(rid => rid !== id);
    setRecentIds(updatedIds);
    localStorage.setItem('recentMembershipIds', JSON.stringify(updatedIds));
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-background via-background to-background">
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 -z-10">
        {/* Dynamic Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-400/20 via-background to-secondary-400/20 animate-gradient-slow" />
        
        {/* Animated Particle Grid */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(100)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary-500 rounded-full"
              initial={{ opacity: Math.random() }}
              animate={{
                opacity: [Math.random(), Math.random()],
                scale: [1, Math.random() + 0.5, 1],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        {/* Floating Geometric Shapes */}
        <div className="absolute inset-0 overflow-hidden">
          {[Triangle, Circle, Square].map((Shape, index) => (
            <motion.div
              key={index}
              className="absolute"
              initial={{ opacity: 0.1 }}
              animate={{
                x: [0, Math.random() * 400 - 200],
                y: [0, Math.random() * 400 - 200],
                rotate: [0, 360],
                opacity: [0.1, 0.2, 0.1],
              }}
              transition={{
                duration: Math.random() * 20 + 10,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "linear",
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            >
              <Shape
                size={Math.random() * 60 + 40}
                className={`text-${index % 2 ? 'primary' : 'secondary'}-500`}
                strokeWidth={0.5}
              />
            </motion.div>
          ))}
        </div>

        {/* Light Beam Effect */}
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 0.05, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/10 via-transparent to-secondary-500/10 rotate-12 transform-gpu" />
        </motion.div>

        {/* Glowing Orbs */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full blur-3xl"
            animate={{
              x: ['0%', '100%', '0%'],
              y: ['0%', '100%', '0%'],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 15 + i * 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 2,
            }}
            style={{
              width: `${100 + i * 50}px`,
              height: `${100 + i * 50}px`,
              background: `radial-gradient(circle, var(--colors-${i % 2 ? 'primary' : 'secondary'}-500) 0%, transparent 70%)`,
              opacity: 0.15,
              left: `${i * 25}%`,
              top: `${i * 20}%`,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md space-y-8"
      >
        {/* Logo Animation */}
        <motion.div
          className="text-center space-y-4"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          <motion.div
            className="flex justify-center"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="w-24 h-24 rounded-full flex items-center justify-center relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-primary-500 to-secondary-500"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
              <span className="relative text-5xl font-bold text-white drop-shadow-lg">
                bS
              </span>
            </div>
          </motion.div>
          
          <div className="space-y-2">
              <h1 className="text-4xl font-bold">
                <span className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
                  byShujaa
                </span>
              </h1>
              <p className="text-foreground/60">
                Enter your membership ID to access your personal training dashboard
              </p>
            </div>
        </motion.div>

        {/* Enhanced Login Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card
            isBlurred={theme === 'dark'}
            className="shadow-medium hover:shadow-xl transition-shadow duration-300"
          >
            <CardBody className="gap-6 p-6">
              {/* Recent IDs with Animation - Updated Design */}
              {recentIds.length > 0 && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  className="space-y-3"
                >
                  <p className="text-sm text-foreground/60 flex items-center gap-2 font-medium">
                    <Clock size={14} className="text-primary-500" />
                    Recent logins
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {recentIds.map((id) => (
                      <Chip
                        key={id}
                        variant="flat"
                        onClose={() => removeRecentId(id)}
                        onClick={() => handleLogin(id)}
                        className="cursor-pointer bg-gradient-to-r from-primary-500/10 to-secondary-500/10 hover:from-primary-500/20 hover:to-secondary-500/20 border border-primary-500/20"
                        classNames={{
                          base: "hover:scale-105 transition-all duration-200",
                          content: "font-medium text-foreground/80",
                          closeButton: "text-foreground/50 hover:text-foreground/80"
                        }}
                      >
                        {id}
                      </Chip>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Enhanced Input - Updated Design */}
              <motion.div whileTap={{ scale: 0.995 }}>
                <Input
                  label="Membership ID"
                  labelPlacement="inside"
                  value={membershipId}
                  onValueChange={setMembershipId}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  errorMessage={error}
                  isInvalid={!!error}
                  startContent={
                    <Key 
                      className="text-primary-500" 
                      size={18}
                    />
                  }
                  variant="bordered"
                  size="lg"
                  classNames={{
                    label: "text-foreground/90 font-medium",
                    input: [
                      "bg-transparent",
                      "text-foreground/90",
                      "placeholder:text-foreground/50",
                      "font-medium",
                    ],
                    innerWrapper: "bg-transparent",
                    inputWrapper: [
                      "shadow-sm",
                      "bg-content1/20",
                      "backdrop-blur-md",
                      "hover:bg-content1/30",
                      "group-data-[focused=true]:bg-content1/30",
                      "!cursor-text",
                      "transition-all",
                      "duration-200",
                      "border-2",
                      "group-data-[focused=true]:border-primary-500",
                      "group-data-[invalid=true]:border-danger-500",
                      "group-data-[invalid=true]:hover:border-danger-500",
                      error ? "hover:border-danger-500" : "hover:border-primary-500",
                    ],
                  }}
                  autoFocus
                />
              </motion.div>
              
              {/* Enhanced Button - Updated Design */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  color="primary"
                  onClick={() => handleLogin()}
                  isLoading={isLoading}
                  className={`
                    w-full 
                    bg-gradient-to-r from-primary-500 to-secondary-500 
                    hover:from-primary-600 hover:to-secondary-600
                    shadow-lg shadow-primary-500/20
                    hover:shadow-primary-500/40
                    transition-all duration-300
                    font-medium
                    text-lg
                    h-12
                  `}
                  startContent={
                    !isLoading && (
                      <Key 
                        size={20} 
                        className="text-white/90" 
                      />
                    )
                  }
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    "Continue"
                  )}
                </Button>
              </motion.div>
            </CardBody>
          </Card>
        </motion.div>

        {/* Footer with Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center"
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
      </motion.div>
    </div>
  );
};

export default Login;