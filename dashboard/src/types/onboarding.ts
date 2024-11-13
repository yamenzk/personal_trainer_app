// src/types/onboarding.ts

import { BaseStepProps } from './base';
import { Client } from './client';

export type FitnessGoal = 'Weight Loss' | 'Weight Gain' | 'Muscle Building' | 'Maintenance';
export type ActivityLevel = 'Sedentary' | 'Light' | 'Moderate' | 'Very Active' | 'Extra Active';
export type WorkoutLocation = 'Gym' | 'Home';

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

export interface StepConfig {
  component: React.ComponentType<any>;
  title: string;
  subtitle: string;
  field: StepFields;
}

export interface StepComponentProps<T = any> extends BaseStepProps {
  initialValue?: T;
}

export interface OnboardingWizardProps {
  clientData: Client;
  onComplete: () => void;
  steps?: string[];
}

// Define the step values type
export type StepValues = {
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

export interface WeightTarget {
  id: string;
  label: string;
  weeklyRate: number;
  description: string;
  color: 'primary' | 'secondary' | 'success' | 'warning';
}

export interface CalculatedTarget extends WeightTarget {
  targetWeight: number;
  totalChange: number;
}

export interface GoalRecommendations {
  targets: WeightTarget[];
}

export type GoalRecommendationMap = Record<FitnessGoal, GoalRecommendations>;

export interface TargetWeightStepProps extends BaseStepProps {
  onComplete: (value: number) => void;
  onValidationChange?: (isValid: boolean) => void;
  currentWeight: number;
  selectedGoal?: FitnessGoal;
  initialValue?: number;
  membershipStart?: string;
  membershipEnd?: string;
}

export interface NameStepProps extends StepComponentProps<string> {}
export interface EmailStepProps extends StepComponentProps<string> {}
export interface DateOfBirthStepProps extends StepComponentProps<string> {}
export interface GenderStepProps extends StepComponentProps<string> {}
export interface NationalityStepProps extends StepComponentProps<string> {}
export interface HeightStepProps extends StepComponentProps<number> {}
export interface WeightStepProps extends StepComponentProps<number> {}
export interface GoalStepProps extends StepComponentProps<FitnessGoal> {}
export interface ActivityLevelStepProps extends StepComponentProps<ActivityLevel> {}
export interface EquipmentStepProps extends StepComponentProps<WorkoutLocation> {}
export interface WorkoutsStepProps extends StepComponentProps<number> {}
export interface MealsStepProps extends StepComponentProps<number> {}
export interface TargetWeightStepProps extends StepComponentProps<number> {
  currentWeight: number;
  selectedGoal?: FitnessGoal;
}