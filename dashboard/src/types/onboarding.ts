// src/types/onboarding.ts
import { FitnessGoal } from '@/components/onboarding/steps/GoalStep';

export interface BaseStepProps {
  onComplete: (value: any) => void;
  onValidationChange?: (isValid: boolean) => void;
}

// Define a union type for fields
export type StepFields = 
  | 'client_name'
  | 'email' 
  | 'date_of_birth'
  | 'gender'
  | 'nationality'
  | 'height'
  | 'weight'
  | 'goal'
  | 'target_weight'
  | 'activity_level'
  | 'equipment'
  | 'workouts'
  | 'meals';

// Define a type for step configuration
export interface StepConfig {
  component: React.ComponentType<any>;
  title: string;
  subtitle: string;
  field: StepFields;
}

// Define step props with proper typing
export interface StepComponentProps<T = any> extends BaseStepProps {
  initialValue?: T;
}

// Specific step props
export interface NameStepProps extends StepComponentProps<string> {}
export interface EmailStepProps extends StepComponentProps<string> {}
export interface DateOfBirthStepProps extends StepComponentProps<string> {}
export interface GenderStepProps extends StepComponentProps<string> {}
export interface NationalityStepProps extends StepComponentProps<string> {}
export interface HeightStepProps extends StepComponentProps<number> {}
export interface WeightStepProps extends StepComponentProps<number> {}
export interface GoalStepProps extends StepComponentProps<FitnessGoal> {}
export interface ActivityLevelStepProps extends StepComponentProps<string> {}
export interface EquipmentStepProps extends StepComponentProps<'Gym' | 'Home'> {}
export interface WorkoutsStepProps extends StepComponentProps<number> {}
export interface MealsStepProps extends StepComponentProps<number> {}
export interface TargetWeightStepProps extends StepComponentProps<number> {
  currentWeight: number;
  selectedGoal?: FitnessGoal;
}