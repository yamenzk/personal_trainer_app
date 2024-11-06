import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Progress, Button } from "@nextui-org/react";
import { Client } from '@/types/client';
import { GlassCard } from '../shared/GlassCard';
import { ChevronLeft } from 'lucide-react';

// Import step components
import ActivityLevelStep from './steps/ActivityLevelStep';
import DateOfBirthStep from './steps/DateOfBirthStep';
import EmailStep from './steps/EmailStep';
import EquipmentStep from './steps/EquipmentStep';
import GenderStep from './steps/GenderStep';
import GoalStep from './steps/GoalStep';
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

// Add this type if not already defined
interface Weight {
  weight: number;
  date: string;
}

// Step configuration
const StepComponents = {
  'Name': {
    component: NameStep,
    title: 'What is your name?',
    subtitle: '',
    field: 'client_name'
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
    subtitle: 'This helps me calculate your nutritional needs',
    field: 'gender'
  },
  'Email': {
    component: EmailStep,
    title: 'What is your email?',
    subtitle: 'To keep you updated on your progress',
    field: 'email'
  },
  'Nationality': {
    component: NationalityStep,
    title: 'Where do you come from?',
    subtitle: 'For demographics and reach purposes',
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
  'TargetWeight': {
    component: TargetWeightStep,
    title: 'What\'s your target weight?',
    subtitle: 'Let\'s set a goal to work towards',
    field: 'target_weight'
  },
  'ActivityLevel': {
    component: ActivityLevelStep,
    title: 'How active are you?',
    subtitle: 'This helps me adjust your program intensity',
    field: 'activity_level'
  },
  'Equipment': {
    component: EquipmentStep,
    title: 'Where will you work out?',
    subtitle: 'Will use this to customize exercises based on available equipment',
    field: 'equipment'
  },
  'Goal': {
    component: GoalStep,
    title: 'What is your goal?',
    subtitle: 'This helps me tailor your program to your needs',
    field: 'goal'
  },
  'Meals': {
    component: MealsStep,
    title: 'How many meals per day?',
    subtitle: 'Let\'s plan your nutrition schedule',
    field: 'meals'
  },
  'Workouts': {
    component: WorkoutsStep,
    title: 'How often will you train?',
    subtitle: 'Let\'s design your workout frequency',
    field: 'workouts'
  }
} as const;

// Default steps order for full onboarding
const DEFAULT_STEPS = [
  'Name',
  'DateOfBirth',
  'Gender',
  'Email',
  'Nationality',
  'Height',
  'Weight',
  'TargetWeight',
  'ActivityLevel',
  'Equipment',
  'Goal',
  'Meals',
  'Workouts'
];

export const OnboardingWizard = ({ clientData, onComplete, steps }: OnboardingWizardProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<Client>>({});
  const [loading, setLoading] = useState(false);
  const [updatedClientData, setUpdatedClientData] = useState(clientData);

  // Use provided steps or default steps
  const activeSteps = steps 
    ? steps.map(step => ({
        ...StepComponents[step as keyof typeof StepComponents],
        key: step
      }))
    : DEFAULT_STEPS.map(step => ({
        ...StepComponents[step as keyof typeof StepComponents],
        key: step
      }));

      const refreshClientData = async () => {
        try {
          const response = await fetch(
            `/api/v2/method/personal_trainer_app.api.get_membership?membership=${clientData.name}`
          );
          if (!response.ok) throw new Error('Failed to fetch updated data');
          const data = await response.json();
          setUpdatedClientData(data.data.client);
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
          
          if (!response.ok) {
            throw new Error('Failed to update data');
          }
      
          // For all steps except the last one, move to next step
          if (currentStep < activeSteps.length - 1) {
            setCurrentStep(prev => prev + 1);
          } else {
            // For the last step, refresh data first then complete
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
    }
  };

  const progress = ((currentStep + 1) / activeSteps.length) * 100;
  const currentStepConfig = activeSteps[currentStep];
  const CurrentStepComponent = activeSteps[currentStep].component;

  return (
    <div className="fixed inset-0 z-50 bg-gray-900">
      <div className="h-full overflow-auto">
        <div className="min-h-full w-full max-w-2xl mx-auto p-4 py-8 flex flex-col">
          {/* Progress bar */}
          <div className="z-10 mb-6">
            <GlassCard
              variant="gradient"
              className="mt-2 border-2 border-transparent rounded-xl"
            >
              <div className="p-4 space-y-2">
  <div className="flex justify-between items-center">
    <span className="text-sm font-medium text-foreground">
      {steps?.length === activeSteps.length 
        ? 'Updating your preferences'
        : `Completing ${activeSteps.length} required field${activeSteps.length !== 1 ? 's' : ''}`
      }
    </span>
    <span className="text-sm font-medium">
      {currentStep + 1} of {activeSteps.length}
    </span>
  </div>
  <Progress
    aria-label="Onboarding progress"
    value={progress}
    className="h-2"
    color="primary"
    classNames={{
      indicator: "bg-gradient-to-r from-primary-500 to-secondary-500"
    }}
  />
</div>
            </GlassCard>
          </div>

          {/* Step content */}
          <div className="flex-1 flex">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <div className="relative">
                  {/* Back button */}
                  {currentStep > 0 && (
                    <Button
                      isIconOnly
                      variant="light"
                      className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 hidden md:flex"
                      onPress={handleBack}
                    >
                      <ChevronLeft size={20} />
                    </Button>
                  )}

                  {/* Step Card */}
                  <GlassCard variant="frosted" className="rounded-xl">
                    <div className="p-6 sm:p-8">
                      <div className="text-center mb-8 space-y-2">
                        <h2 className="text-2xl font-bold">
                          {currentStepConfig.title}
                        </h2>
                        {currentStepConfig.subtitle && (
                          <p className="text-base text-foreground/60">
                            {currentStepConfig.subtitle}
                          </p>
                        )}
                      </div>

                      <currentStepConfig.component
                        onComplete={handleStepComplete}
                        currentWeight={
                          currentStepConfig.key === 'TargetWeight' 
                            ? (
                              // Safely extract the number value from either formData or clientData
                              typeof formData.weight === 'number' 
                                ? formData.weight 
                                : clientData.weight?.[0]?.weight ?? 0
                            )
                            : (clientData.weight?.[0]?.weight ?? 0)
                        }
                        isLoading={loading}
                      />
                    </div>
                  </GlassCard>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Mobile back button */}
          {currentStep > 0 && (
            <div className="mt-4 md:hidden">
              <Button
                variant="light"
                className="w-full"
                onPress={handleBack}
                startContent={<ChevronLeft size={20} />}
              >
                Back
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingWizard;