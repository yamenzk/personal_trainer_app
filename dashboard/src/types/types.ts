// src/types/types.ts
import { LucideIcon } from 'lucide-react';
import type { ExercisePerformance } from './api';

export interface InputProps {
  value: any;
  onChange: (value: any) => void;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface StepComponent<T = any> {
  value: T;
  onChange: (value: T) => void;
}

export interface FormFields {
  client_name?: string;
  date_of_birth?: string;
  gender?: 'Male' | 'Female';
  mobile?: string;
  nationality?: string;
  goal?: string;
  target_weight?: number;
  meals?: number;
  workouts?: number;
  equipment?: 'Home' | 'Gym';
  activity_level?: 'Sedentary' | 'Light' | 'Moderate' | 'Very Active' | 'Extra Active';
  height?: number;
  weight?: number;
  exercise_performance?: ExercisePerformance;
}

export interface Step<T = any> {
  field: keyof FormFields;
  title: string;
  description: string;
  icon: LucideIcon;
  component: React.FC<StepComponent<T>>;
}

export type StepDefinition = {
  client_name: Step<string>;
  date_of_birth: Step<string>;
  gender: Step<'Male' | 'Female'>;
  mobile: Step<string>;
  nationality: Step<string>;
  goal: Step<string>;
  target_weight: Step<number>;
  meals: Step<number>;
  workouts: Step<number>;
  equipment: Step<'Home' | 'Gym'>;
  activity_level: Step<'Sedentary' | 'Light' | 'Moderate' | 'Very Active' | 'Extra Active'>;
  height: Step<number>;
  weight: Step<number>;
  exercise_performance: Step<ExercisePerformance>;
}

export type StepKey = keyof StepDefinition;

export type WizardMode = 'onboarding' | 'weight-update' | 'preferences' | 'performance';

// Input component specific types
export interface DateInputProps extends StepComponent<string> {}

export interface GenderSelectProps extends StepComponent<'Male' | 'Female'> {}

export interface PhoneInputProps extends StepComponent<string> {}

export interface NationalityInputProps extends StepComponent<string> {}

export interface GoalSelectProps extends StepComponent<string> {}

export interface WorkoutLocationSelectProps extends StepComponent<'Home' | 'Gym'> {}

export interface ActivityLevelSelectProps extends StepComponent<'Sedentary' | 'Light' | 'Moderate' | 'Very Active' | 'Extra Active'> {}

export interface HeightInputProps extends StepComponent<number> {}

export interface WeightInputProps extends StepComponent<number> {}

export interface ExercisePerformanceInputProps extends StepComponent<ExercisePerformance> {
  previousRecord?: ExercisePerformance;  // Add this line
}

export interface RangeInputProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  label: (value: number) => string;
  type: 'meals' | 'workouts';  // Add this line
}

export interface ExerciseData {
  name: string;
  dayKey: string;
}

export interface WizardContextType {
  isOpen: boolean;
  mode: WizardMode | null;
  exerciseData: ExerciseData | null;
  openWizard: (mode: WizardMode, exerciseData?: ExerciseData) => void;
  closeWizard: () => void;
}
