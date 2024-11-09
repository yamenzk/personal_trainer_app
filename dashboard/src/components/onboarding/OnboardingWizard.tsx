// src/components/onboarding/OnboardingWizard.tsx
import { useState, useEffect } from 'react';
import { Progress, Button, Card, CardBody, CardHeader } from "@nextui-org/react";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Client } from '@/types/client';
import { motion, AnimatePresence } from "framer-motion";

// Import step components
import ActivityLevelStep from './steps/ActivityLevelStep';
import DateOfBirthStep from './steps/DateOfBirthStep';
import EmailStep from './steps/EmailStep';
import EquipmentStep from './steps/EquipmentStep';
import GenderStep from './steps/GenderStep';
import GoalStep, { FitnessGoal } from './steps/GoalStep';
import HeightStep from './steps/HeightStep';
import MealsStep from './steps/MealsStep';
import NameStep from './steps/NameStep';
import NationalityStep from './steps/NationalityStep';
import TargetWeightStep from './steps/TargetWeightStep';
import WeightStep from './steps/WeightStep';
import WorkoutsStep from './steps/WorkoutsStep';

interface OnboardingWizardProps {
  clientData: Client;
  onComplete: () => void;
  steps?: string[];
}

// Define the step values type
type StepValues = {
  client_name?: string;
  email?: string;
  date_of_birth?: string;
  gender?: string;
  nationality?: string;
  height?: number;
  weight?: number;
  goal?: FitnessGoal;
  target_weight?: number;
  activity_level?: string;
  equipment?: 'Gym' | 'Home';
  workouts?: number;
  meals?: number;
};

// Define the step configuration type
interface StepConfig {
  component: React.ComponentType<any>;
  title: string;
  subtitle: string;
  field: keyof StepValues;
}

const StepComponents: Record<string, StepConfig> = {
  'Name': {
    component: NameStep,
    title: '',
    subtitle: '',
    field: 'client_name'
  },
  'Email': {
    component: EmailStep,
    title: 'What is your email?',
    subtitle: '',
    field: 'email'
  },
  'DateOfBirth': {
    component: DateOfBirthStep,
    title: 'When were you born?',
    subtitle: '',
    field: 'date_of_birth'
  },
  'Gender': {
    component: GenderStep,
    title: 'What is your gender?',
    subtitle: '',
    field: 'gender'
  },
  'Nationality': {
    component: NationalityStep,
    title: 'Where do you come from?',
    subtitle: '',
    field: 'nationality'
  },
  'Height': {
    component: HeightStep,
    title: 'What\'s your height?',
    subtitle: '',
    field: 'height'
  },
  'Weight': {
    component: WeightStep,
    title: 'What\'s your current weight?',
    subtitle: '',
    field: 'weight'
  },
  'Goal': {
    component: GoalStep,
    title: 'What is your goal?',
    subtitle: '',
    field: 'goal'
  },
  'TargetWeight': {
    component: TargetWeightStep,
    title: 'What\'s your target weight?',
    subtitle: '',
    field: 'target_weight'
  },
  'ActivityLevel': {
    component: ActivityLevelStep,
    title: 'How active are you?',
    subtitle: '',
    field: 'activity_level'
  },
  'Equipment': {
    component: EquipmentStep,
    title: 'Where will you work out?',
    subtitle: '',
    field: 'equipment'
  },
  'Workouts': {
    component: WorkoutsStep,
    title: 'How often will you train?',
    subtitle: '',
    field: 'workouts'
  },
  'Meals': {
    component: MealsStep,
    title: 'How many meals per day?',
    subtitle: '',
    field: 'meals'
  }
} as const;

const OPTIMIZED_STEPS = [
  'Name',
  'Email',
  'DateOfBirth',
  'Gender',
  'Nationality',
  'Height',
  'Weight',
  'Goal',
  'TargetWeight',
  'ActivityLevel',
  'Equipment',
  'Workouts',
  'Meals'
] as const;

export const OnboardingWizard = ({ clientData, onComplete, steps }: OnboardingWizardProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<StepValues>({});
  const [loading, setLoading] = useState(false);
  const [isStepValid, setIsStepValid] = useState(false);

  // Use optimized steps order unless specific steps are provided
  const activeSteps = (steps 
    ? OPTIMIZED_STEPS
        .filter(step => steps.includes(step))
        .map(step => ({
          ...StepComponents[step],
          key: step
        }))
    : OPTIMIZED_STEPS.map(step => ({
        ...StepComponents[step],
        key: step
      })));

  const refreshClientData = async () => {
    try {
      const response = await fetch(
        `/api/v2/method/personal_trainer_app.api.get_membership?membership=${clientData.name}`
      );
      if (!response.ok) throw new Error('Failed to fetch updated data');
      const data = await response.json();
      return data.data.client;
    } catch (error) {
      console.error('Error fetching updated client data:', error);
      return null;
    }
  };

  const handleStepComplete = async (value: any) => {
    setLoading(true);
    try {
      const stepConfig = activeSteps[currentStep];
      setFormData(prev => ({ ...prev, [stepConfig.field]: value }));

      const params = new URLSearchParams();
      params.append('client_id', clientData.name);
      params.append(stepConfig.field, value.toString());
      
      const response = await fetch(
        `/api/v2/method/personal_trainer_app.api.update_client?${params.toString()}`
      );
      
      if (!response.ok) throw new Error('Failed to update data');

      if (currentStep < activeSteps.length - 1) {
        setCurrentStep(prev => prev + 1);
        setIsStepValid(false);
      } else {
        await refreshClientData();
        onComplete();
      }
    } catch (error) {
      console.error('Error updating data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setIsStepValid(true);
    }
  };

  const handleNext = () => {
    if (!isStepValid) return;
    
    const currentStepValue = formData[activeSteps[currentStep].field];
    if (currentStepValue) {
      handleStepComplete(currentStepValue);
    }
  };

  const progress = ((currentStep + 1) / activeSteps.length) * 100;
  const currentStepConfig = activeSteps[currentStep];

  const renderCurrentStep = () => {
    const commonProps = {
      onComplete: (value: any) => setFormData(prev => ({ 
        ...prev, 
        [currentStepConfig.field]: value 
      })),
      onValidationChange: setIsStepValid,
    };

    if (currentStepConfig.field === 'target_weight') {
      return (
        <TargetWeightStep
          {...commonProps}
          initialValue={formData.target_weight}
          selectedGoal={formData.goal}
          currentWeight={Number(formData.weight ?? clientData.weight?.[0]?.weight ?? 0)}
        />
      );
    }

    return (
      <currentStepConfig.component
        {...commonProps}
        initialValue={formData[currentStepConfig.field]}
      />
    );
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-background overflow-hidden">
      {/* Simplified Background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Static gradient overlay */}
        <div className="absolute inset-0 bg-gradient-fade-b from-background via-background to-content2" />
        
        {/* Static dot pattern */}
        <div className="absolute inset-0 opacity-[0.15] bg-[radial-gradient(circle_at_1px_1px,#808080_1px,transparent_0)] bg-[size:40px_40px]" />
        
        {/* Static decorative elements */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-500/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="fixed top-0 inset-x-0 z-50">
        <div className="bg-background/60 backdrop-blur-sm border-b border-divider/50">
          <div className="max-w-2xl mx-auto px-6 py-4 space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-500/10 text-primary-500">
                  <span className="text-sm font-semibold">{currentStep + 1}</span>
                </div>
                <span className="text-sm font-medium text-foreground/60">
                  of {activeSteps.length} steps
                </span>
              </div>
              <span className="text-sm font-medium bg-gradient-to-r from-primary-500 to-secondary-500 text-transparent bg-clip-text">
                {Math.round(progress)}% Complete
              </span>
            </div>
            <Progress 
              aria-label="Onboarding progress" 
              value={progress} 
              className="h-1.5 rounded-full overflow-hidden"
              color="primary"
              classNames={{
                indicator: "bg-gradient-to-r from-primary-500 to-secondary-500"
              }}
            />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="min-h-full flex items-center justify-center">
          <div 
            className="w-full max-w-2xl"
            style={{
              marginTop: 'calc(84px + env(safe-area-inset-top))',
              marginBottom: 'calc(84px + env(safe-area-inset-bottom))'
            }}
          >
            <Card className="w-full border-none shadow-none bg-transparent">
              <CardHeader className="text-center pb-0 pt-8 px-8">
                <div className="w-full space-y-3">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 text-transparent bg-clip-text">
                    {currentStepConfig.title}
                  </h2>
                  {currentStepConfig.subtitle && (
                    <p className="text-base text-foreground/60 leading-relaxed">
                      {currentStepConfig.subtitle}
                    </p>
                  )}
                </div>
              </CardHeader>
              <CardBody className="px-8 py-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.2 }}
                  >
                    {renderCurrentStep()}
                  </motion.div>
                </AnimatePresence>
              </CardBody>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 inset-x-0 z-50">
        <div className="bg-background/60 backdrop-blur-sm border-t border-divider/50">
          <div className="max-w-2xl mx-auto px-6 py-5 flex items-center justify-between gap-4">
            <Button
              variant="ghost"
              onPress={handleBack}
              isDisabled={currentStep === 0}
              startContent={<ChevronLeft className="w-4 h-4" />}
              className="flex-1 sm:flex-none"
            >
              Back
            </Button>
            <Button
              color="primary"
              className="flex-1 sm:flex-none bg-gradient-to-r from-primary-500 to-secondary-500"
              onPress={handleNext}
              isLoading={loading}
              isDisabled={!isStepValid}
              endContent={!loading && <ChevronRight className="w-4 h-4" />}
            >
              {currentStep === activeSteps.length - 1 ? 'Complete' : 'Continue'}
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default OnboardingWizard;