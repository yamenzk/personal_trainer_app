// src/components/onboarding/OnboardingWizard.tsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Progress } from "@nextui-org/react";
import { Client } from '../../types/client';
import DateOfBirthStep from './steps/DateOfBirthStep';
import GenderStep from './steps/GenderStep';
import EmailStep from './steps/EmailStep';
import NationalityStep from './steps/NationalityStep';
import MealsStep from './steps/MealsStep';
import WorkoutsStep from './steps/WorkoutsStep';
import ActivityLevelStep from './steps/ActivityLevelStep';
import EquipmentStep from './steps/EquipmentStep';
import HeightStep from './steps/HeightStep';
import WeightStep from './steps/WeightStep';
import TargetWeightStep from './steps/TargetWeightStep';

interface OnboardingWizardProps {
  clientData: Client;
  onComplete: () => void;
}

// Define the base properties that all steps share
interface BaseStepProps {
  onComplete: (value: any) => void;
}

// Define specific step props
interface WeightRequiredStepProps extends BaseStepProps {
  currentWeight: number;
}

interface BasicStep {
  type: 'basic';
  component: React.ComponentType<BaseStepProps>;
}

interface WeightRequiredStep {
  type: 'weight-required';
  component: React.ComponentType<WeightRequiredStepProps>;
}

type StepType = BasicStep | WeightRequiredStep;

interface StepConfig {
  field: keyof Client;
  stepType: StepType;
}

const OnboardingWizard = ({ clientData, onComplete }: OnboardingWizardProps) => {
  const [steps, setSteps] = useState<StepConfig[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<Client>>({});

  useEffect(() => {
    const requiredSteps: StepConfig[] = [];
    
    if (!clientData.date_of_birth) {
      requiredSteps.push({ 
        field: 'date_of_birth',
        stepType: { type: 'basic', component: DateOfBirthStep }
      });
    }
    if (!clientData.gender) {
      requiredSteps.push({ 
        field: 'gender',
        stepType: { type: 'basic', component: GenderStep }
      });
    }
    if (!clientData.email) {
      requiredSteps.push({ 
        field: 'email',
        stepType: { type: 'basic', component: EmailStep }
      });
    }
    if (!clientData.nationality) {
      requiredSteps.push({ 
        field: 'nationality',
        stepType: { type: 'basic', component: NationalityStep }
      });
    }
    if (!clientData.meals) {
      requiredSteps.push({ 
        field: 'meals',
        stepType: { type: 'basic', component: MealsStep }
      });
    }
    if (!clientData.workouts) {
      requiredSteps.push({ 
        field: 'workouts',
        stepType: { type: 'basic', component: WorkoutsStep }
      });
    }
    if (!clientData.activity_level) {
      requiredSteps.push({ 
        field: 'activity_level',
        stepType: { type: 'basic', component: ActivityLevelStep }
      });
    }
    if (!clientData.equipment) {
      requiredSteps.push({ 
        field: 'equipment',
        stepType: { type: 'basic', component: EquipmentStep }
      });
    }
    if (!clientData.height) {
      requiredSteps.push({ 
        field: 'height',
        stepType: { type: 'basic', component: HeightStep }
      });
    }
    if (!clientData.weight?.length) {
      requiredSteps.push({ 
        field: 'weight',
        stepType: { type: 'basic', component: WeightStep }
      });
    }
    if (!clientData.target_weight) {
      requiredSteps.push({ 
        field: 'target_weight',
        stepType: { type: 'weight-required', component: TargetWeightStep }
      });
    }
    
    setSteps(requiredSteps);
  }, [clientData]);

  const handleStepComplete = async (field: keyof Client, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    try {
      const params = new URLSearchParams();
      params.append('client_id', clientData.name);
      params.append(field, value.toString());
      
      const response = await fetch(
        `/api/v2/method/personal_trainer_app.api.update_client?${params.toString()}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to update client data');
      }
      
      if (currentStep < steps.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        onComplete();
      }
    } catch (error) {
      console.error('Error updating client data:', error);
    }
  };

  if (steps.length === 0) {
    return null;
  }

  const progress = ((currentStep + 1) / steps.length) * 100;
  const currentStepConfig = steps[currentStep];

  const renderCurrentStep = () => {
    if (!currentStepConfig) return null;

    const { stepType } = currentStepConfig;
    
    if (stepType.type === 'weight-required') {
      const WeightComponent = stepType.component;
      return (
        <WeightComponent
          onComplete={(value: any) => handleStepComplete(currentStepConfig.field, value)}
          currentWeight={clientData.current_weight}
        />
      );
    } else {
      const BasicComponent = stepType.component;
      return (
        <BasicComponent
          onComplete={(value: any) => handleStepComplete(currentStepConfig.field, value)}
        />
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md">
      <div className="w-full max-w-md p-6">
        <Progress 
          value={progress}
          className="mb-6"
          color="primary"
          size="sm"
        />
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderCurrentStep()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default OnboardingWizard;