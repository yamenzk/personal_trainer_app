// src/components/onboarding/OnboardingWizard.tsx
import { useState, useEffect } from 'react';
import { Progress, Button, Card, CardBody, CardHeader } from "@nextui-org/react";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Client } from '@/types/client';

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
    title: 'What is your name?',
    subtitle: '',
    field: 'client_name'
  },
  'Email': {
    component: EmailStep,
    title: 'What is your email?',
    subtitle: 'To keep you updated on your progress',
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
    subtitle: 'This helps me calculate your nutritional needs',
    field: 'gender'
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
    subtitle: 'Used to calculate your BMI and fitness recommendations',
    field: 'height'
  },
  'Weight': {
    component: WeightStep,
    title: 'What\'s your current weight?',
    subtitle: 'Helps determine your starting point',
    field: 'weight'
  },
  'Goal': {
    component: GoalStep,
    title: 'What is your goal?',
    subtitle: 'This helps me tailor your program to your needs',
    field: 'goal'
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
    subtitle: 'Will customize exercises based on available equipment',
    field: 'equipment'
  },
  'Workouts': {
    component: WorkoutsStep,
    title: 'How often will you train?',
    subtitle: 'Let\'s design your workout frequency',
    field: 'workouts'
  },
  'Meals': {
    component: MealsStep,
    title: 'How many meals per day?',
    subtitle: 'Let\'s plan your nutrition schedule',
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
      {/* Background Pattern */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-content2" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:44px_44px]" />
      </div>

      {/* Fixed Header */}
      <header className="fixed top-0 inset-x-0 z-50">
        <div className="bg-background/80 backdrop-blur-md border-b border-divider/50">
          <div className="max-w-2xl mx-auto px-4 py-3 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-foreground/60">
                Step {currentStep + 1} of {activeSteps.length}
              </span>
              <span className="text-sm font-medium">
                {Math.round(progress)}%
              </span>
            </div>
            <Progress 
              aria-label="Onboarding progress" 
              value={progress} 
              className="h-1"
              color="primary"
              classNames={{
                indicator: "bg-gradient-to-r from-primary-500 to-secondary-500"
              }}
            />
          </div>
        </div>
      </header>

      {/* Scrollable Content Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="min-h-full flex items-center justify-center">
          <div 
            className="w-full max-w-2xl py-4"
            style={{
              marginTop: 'calc(76px + env(safe-area-inset-top))',
              marginBottom: 'calc(76px + env(safe-area-inset-bottom))'
            }}
          >
            <Card className="w-full border-none shadow-none bg-transparent">
              <CardHeader className="text-center pb-0 pt-6 px-6">
                <div className="w-full space-y-2">
                  <h2 className="text-2xl font-bold text-foreground">
                    {currentStepConfig.title}
                  </h2>
                  {currentStepConfig.subtitle && (
                    <p className="text-base text-foreground/60">
                      {currentStepConfig.subtitle}
                    </p>
                  )}
                </div>
              </CardHeader>
              <CardBody className="px-6 py-6">
                {renderCurrentStep()}
              </CardBody>
            </Card>
          </div>
        </div>
      </main>

      {/* Fixed Footer */}
      <footer className="fixed bottom-0 inset-x-0 z-50">
        <div className="bg-background/80 backdrop-blur-md border-t border-divider/50">
          <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
            <Button
              variant="flat"
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
              endContent={<ChevronRight className="w-4 h-4" />}
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