// src/components/wizard/SetupWizard.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/stores/authStore';
import { 
  ArrowLeft, 
  Loader2,
  ChevronRight,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { getStepsForMode } from './steps';
import type { Step, WizardMode, FormFields } from '@/types/types';
import type { Client } from '@/types/api';
import { ExercisePerformance } from '@/types/api';
import { ExerciseData } from '@/types/types';

interface SetupWizardProps {
  mode: WizardMode;
  exercise?: string;
  exerciseData?: ExerciseData;
  onClose?: () => void;
}

// Create a wrapper component
const SetupWizardWrapper: React.FC<SetupWizardProps> = (props) => {
  const client = useAuthStore(state => state.client);
  const refreshData = useAuthStore(state => state.refreshData);

  if (!client) return null;

  return <SetupWizardContent {...props} client={client} refreshData={refreshData} />;
};

// Background Elements Component
const BackgroundElements = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden">
    {/* Modern Grid Pattern */}
    <div className="absolute inset-0 bg-grid-white/[0.02] dark:bg-grid-black/[0.02]" />
    
    {/* Gradient Orbs */}
    <div className="absolute inset-0">
      <motion.div
        className="absolute top-1/4 -left-40 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50"
        animate={{
          x: [0, 120, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      <motion.div
        className="absolute -bottom-20 -right-20 w-96 h-96 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50"
        animate={{
          x: [0, -70, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50"
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
    </div>

    {/* Optional: Subtle noise texture */}
    <div className="absolute inset-0 bg-noise opacity-[0.02]" />
  </div>
);

const StepIndicator: React.FC<{ currentStep: number; totalSteps: number }> = ({ currentStep, totalSteps }) => (
  <div className="absolute top-8 left-1/2 -translate-x-1/2">
    <div className="flex items-center space-x-2">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <motion.div
          key={index}
          className={cn(
            "relative h-2 rounded-full transition-all duration-300",
            index === currentStep ? "w-8 bg-blue-500" : "w-2 bg-gray-200 dark:bg-gray-700"
          )}
          initial={false}
          animate={{
            scale: index === currentStep ? 1.2 : 1,
          }}
        >
          {index < currentStep && (
            <motion.div
              className="absolute inset-0 bg-green-500 rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            />
          )}
        </motion.div>
      ))}
    </div>
  </div>
);

// Step Transition Component
const StepTransition: React.FC<{
  children: React.ReactNode;
  direction: number;
}> = ({ children, direction }) => (
  <AnimatePresence mode="wait" initial={false}>
    <motion.div
      key={`step-${direction}`}
      custom={direction}
      initial={{ x: direction > 0 ? 200 : -200, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: direction < 0 ? 200 : -200, opacity: 0 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
      className="h-full w-full"
    >
      {children}
    </motion.div>
  </AnimatePresence>
);

interface SetupWizardContentProps extends SetupWizardProps {
  client: Client;
  refreshData: () => Promise<void>;
}
const SetupWizardContent: React.FC<SetupWizardContentProps> = ({
  mode,
  exercise,
  exerciseData,
  onClose,
  client,
  refreshData
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [formData, setFormData] = useState<FormFields>({});
  const [steps, setSteps] = useState<Step[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [showExitAnimation, setShowExitAnimation] = useState(false);

  // In SetupWizardContent component
useEffect(() => {
  document.body.style.overflow = 'hidden';
  const availableSteps = getStepsForMode(mode, exercise, client);
  setSteps(availableSteps);
}, [mode, exercise, client]);

  const validateStep = (step: Step): boolean => {
    const value = formData[step.field];
    
    if (!value || (typeof value === 'string' && !value.trim())) {
      setValidationErrors(prev => ({
        ...prev,
        [step.field]: 'This field is required'
      }));
      return false;
    }

    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[step.field];
      return newErrors;
    });

    return true;
  };

  const handleNext = async () => {
    if (!validateStep(steps[currentStep])) {
      toast.error("Please complete this step before continuing",{
        duration: 3000,
        dismissible: true,
      });
      return;
    }

    if (currentStep === steps.length - 1) {
      setIsSubmitting(true);
      try {
        await submitChanges();
        await refreshData();
        setShowExitAnimation(true);
        toast.success("Profile updated successfully!",{
          duration: 3000,
          dismissible: true,
        });
        
        if (onClose) {
          await new Promise(resolve => setTimeout(resolve, 800));
          onClose();
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to update profile",{
          duration: 3000,
          dismissible: true,
        });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setDirection(1);
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setDirection(-1);
    setCurrentStep(prev => prev - 1);
  };

  const submitChanges = async () => {
    if (!client?.name) return;
  
    const params = new URLSearchParams();
    params.append('client_id', client.name);
  
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === 'date_of_birth') {
          params.append(key, value);
        } else if (key === 'exercise_performance') {
          const performance = value as ExercisePerformance;
          params.append('is_performance', '1')
          params.append('exercise_ref', exercise || '');
          params.append('exercise_day', exerciseData?.dayKey || '');
          params.append('weight', performance.weight.toString());
          params.append('reps', performance.reps.toString());
        } else {
          params.append(key, value.toString());
          if (key === 'weight'){
            params.append('request_weight', '0');
          }
        }
      }
    });

    const response = await fetch(`/api/v2/method/ptrainer.ptrainer_methods.update_client?${params.toString()}`);
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Failed to update client');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: showExitAnimation ? 0 : 1,
        scale: showExitAnimation ? 0.95 : 1 
      }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-50"
      onAnimationComplete={() => {
        if (showExitAnimation && onClose) {
          onClose();
        }
      }}
    >
      <BackgroundElements />

      <div className="relative h-full flex flex-col max-w-2xl mx-auto pt-24 px-4">
        {/* Progress Indicator */}
        <StepIndicator currentStep={currentStep} totalSteps={steps.length} />

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center wizard-content">
          <StepTransition direction={direction}>
            {steps[currentStep] && (
              <div className="w-full space-y-8">
                {/* Step Header */}
                <motion.div 
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="inline-flex mb-6 p-3 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm">
                    {React.createElement(steps[currentStep].icon, {
                      className: "w-8 h-8 text-blue-500"
                    })}
                  </div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    {steps[currentStep].title}
                  </h2>
                  <p className="mt-3 text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                    {steps[currentStep].description}
                  </p>
                </motion.div>

                {/* Step Content */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="rounded-3xl p-8 "
                >
                  {React.createElement(steps[currentStep].component, {
                    value: formData[steps[currentStep].field],
                    onChange: (value: any) => {
                      setFormData(prev => ({
                        ...prev,
                        [steps[currentStep].field]: value
                      }));
                      validateStep(steps[currentStep]);
                    }
                  })}
                </motion.div>
              </div>
            )}
          </StepTransition>
        </div>

        {/* Navigation */}
        <div className="py-8">
          <div className="flex items-center justify-between max-w-md mx-auto">
            <motion.button
              onClick={handleBack}
              className={cn(
                "flex items-center space-x-2 px-6 py-3 rounded-xl text-gray-600 dark:text-gray-300",
                "hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                currentStep === 0 && "opacity-0 pointer-events-none"
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={currentStep === 0 || isSubmitting}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </motion.button>

            <motion.button
              onClick={handleNext}
              className={cn(
                "flex items-center space-x-3 px-8 py-3 rounded-xl text-white font-medium",
                "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600",
                "shadow-lg shadow-blue-500/25 dark:shadow-blue-500/10",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "relative overflow-hidden"
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isSubmitting}
            >
              <span>
                {currentStep === steps.length - 1 ? 'Complete' : 'Continue'}
              </span>
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <ChevronRight className="w-5 h-5" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Close button for dismissible modes */}
        {onClose && mode !== 'onboarding' && (
          <motion.button
            className="absolute top-8 right-8 p-2 rounded-xl bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 
                     hover:bg-gray-100 dark:hover:bg-gray-700 shadow-lg shadow-black/5 ring-1 ring-gray-900/5 dark:ring-white/5"
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
          >
            <X className="w-6 h-6" />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export { SetupWizardWrapper as SetupWizard };