// src/components/onboarding/OnboardingWizard.tsx
import { useState } from 'react';
import { Progress, Button, Card, CardBody, CardHeader } from "@nextui-org/react";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Client } from '@/types/client';

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

// Step configuration (keeping the same as your original)
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
      
      if (!response.ok) throw new Error('Failed to update data');

      if (currentStep < activeSteps.length - 1) {
        setCurrentStep(prev => prev + 1);
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
    }
  };

  const handleNext = () => {
    const currentStepValue = formData[activeSteps[currentStep].field];
    if (currentStepValue) {
      handleStepComplete(currentStepValue);
    }
  };

  const progress = ((currentStep + 1) / activeSteps.length) * 100;
  const currentStepConfig = activeSteps[currentStep];
  const CurrentStepComponent = activeSteps[currentStep].component;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-content2">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-divider">
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
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 pt-20 pb-24">
        <Card className="w-full border-none shadow-small bg-background/60 backdrop-blur-lg">
          <CardHeader className="text-center pb-0 pt-8 px-8">
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
          <CardBody className="px-8 py-6">
            <CurrentStepComponent
              onComplete={(value) => setFormData(prev => ({ 
                ...prev, 
                [currentStepConfig.field]: value 
              }))}
              currentWeight={
                currentStepConfig.key === 'TargetWeight'
                  ? (typeof formData.weight === 'number' 
                      ? formData.weight 
                      : clientData.weight?.[0]?.weight ?? 0)
                  : (clientData.weight?.[0]?.weight ?? 0)
              }
            />
          </CardBody>
        </Card>
      </main>

      {/* Fixed Footer */}
      <footer className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-t border-divider">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <Button
            variant="light"
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
            endContent={<ChevronRight className="w-4 h-4" />}
          >
            {currentStep === activeSteps.length - 1 ? 'Complete' : 'Continue'}
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default OnboardingWizard;