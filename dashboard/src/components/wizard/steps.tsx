// src/components/wizard/steps.tsx
import { 
  User,
  Calendar,
  Phone,
  Flag,
  Target,
  Clock,
  Dumbbell,
  Activity,
  Scale,
  Ruler,
  Weight
} from 'lucide-react';
import type { StepDefinition, StepKey, Step } from '@/types/types';
import { WizardMode } from '@/types/types';

// Import all input components
import { DateInput } from './inputs/DateInput';
import { GenderSelect } from './inputs/GenderSelect';
import { PhoneInput } from './inputs/PhoneInput';
import { NationalityInput } from './inputs/NationalityInput';
import { GoalSelect } from './inputs/GoalSelect';
import { RangeInput } from './inputs/RangeInput';
import { WorkoutLocationSelect } from './inputs/WorkoutLocationSelect';
import { ActivityLevelSelect } from './inputs/ActivityLevelSelect';
import { HeightInput } from './inputs/HeightInput';
import { WeightInput } from './inputs/WeightInput';
import { ExercisePerformanceInput } from './inputs/ExercisePerformanceInput';
import type { Client } from '@/types/api';
export const getAllSteps = (): StepDefinition[StepKey][] => [
  {
    field: 'client_name',
    title: "What's your name?",
    description: 'Please enter your full name as it appears on your ID',
    icon: User,
    component: ({ value, onChange }) => (
      <div className="relative">
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-6 text-lg rounded-2xl border outline-none transition-all duration-200 
                   bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 
                   focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter your full name"
        />
      </div>
    )
  } as StepDefinition['client_name'],
  
  {
    field: 'date_of_birth',
    title: 'When were you born?',
    description: 'This helps us personalize your experience',
    icon: Calendar,
    component: DateInput
  } as StepDefinition['date_of_birth'],

  {
    field: 'gender',
    title: "What's your gender?",
    description: 'Select the option that best describes you',
    icon: User,
    component: GenderSelect
  } as StepDefinition['gender'],

  {
    field: 'mobile',
    title: "What's your phone number?",
    description: "We'll use this to send you important updates",
    icon: Phone,
    component: PhoneInput
  } as StepDefinition['mobile'],

  {
    field: 'nationality',
    title: "What's your nationality?",
    description: 'Select your country of origin',
    icon: Flag,
    component: NationalityInput
  } as StepDefinition['nationality'],

  {
    field: 'goal',
    title: "What's your primary goal?",
    description: 'This helps us create the perfect plan for you',
    icon: Target,
    component: GoalSelect
  } as StepDefinition['goal'],

  {
    field: 'target_weight',
    title: "What's your target weight?",
    description: 'Let us know where you want to be',
    icon: Scale,
    component: WeightInput
  } as StepDefinition['target_weight'],

  {
    field: 'meals',
    title: 'How many meals per day?',
    description: 'Choose what works best for your schedule',
    icon: Clock,
    component: ({ value, onChange }) => (
      <RangeInput
        value={typeof value === 'number' ? value : 3}
        onChange={onChange}
        min={3}
        max={6}
        step={1}
        type="meals"
        label={(value) => `${value} meals per day`}
      />
    )
  } as StepDefinition['meals'],

  {
    field: 'workouts',
    title: 'How many workouts per week?',
    description: 'Choose what fits your lifestyle',
    icon: Dumbbell,
    component: ({ value, onChange }) => (
      <RangeInput
        value={typeof value === 'number' ? value : 3}
        onChange={onChange}
        min={3}
        max={6}
        step={1}
        type="workouts"
        label={(value) => `${value} workouts per week`}
      />
    )
  } as StepDefinition['workouts'],

  {
    field: 'equipment',
    title: 'Where will you work out?',
    description: 'Choose your preferred training environment',
    icon: Dumbbell,
    component: WorkoutLocationSelect
  } as StepDefinition['equipment'],

  {
    field: 'activity_level',
    title: "What's your activity level?",
    description: 'This helps us calculate your energy needs',
    icon: Activity,
    component: ActivityLevelSelect
  } as StepDefinition['activity_level'],

  {
    field: 'height',
    title: 'How tall are you?',
    description: 'Enter your height',
    icon: Ruler,
    component: HeightInput
  } as StepDefinition['height'],

  {
    field: 'weight',
    title: "What's your current weight?",
    description: 'Enter your current weight',
    icon: Scale,
    component: WeightInput
  } as StepDefinition['weight'],

  {
    field: 'exercise_performance',
    title: 'Log Exercise Performance',
    description: 'Enter your performance for this exercise',
    icon: Weight,
    component: ExercisePerformanceInput
  } as StepDefinition['exercise_performance']
];

export const getStepsForMode = (mode: WizardMode, exercise?: string, client?: Client): Step[] => {
  const allSteps = getAllSteps();
  
  switch (mode) {
    case 'onboarding':
  if (!client) {
    console.warn('Client object is missing for onboarding mode');
    return allSteps; // Return all steps if client is not available
  }

  const fieldsToCheck = [
    'client_name',
    'date_of_birth',
    'gender',
    'mobile',
    'nationality',
    'goal',
    'target_weight',
    'meals',
    'workouts',
    'equipment',
    'activity_level',
    'height'
  ];
  
  const missingFields = fieldsToCheck.filter(field => {
    const value = client[field as keyof Client];
    return value === undefined || value === null || value === '' || value === 0;
  });

  // Include "weight" if at least 3 other fields are missing
  if (missingFields.length >= 3 || client.weight === undefined || client.weight === null) {
    missingFields.push('weight');
  }

  // If no fields are missing, return an empty array
  if (missingFields.length === 0) return [];

  // Return only the steps for missing fields
  return allSteps.filter(step => 
    missingFields.includes(step.field as string)
  );
  
    case 'weight-update':
      return allSteps.filter(step => step.field === 'weight');
    
    case 'preferences':
      return allSteps.filter(step =>
        ['goal', 'target_weight', 'meals', 'workouts', 'equipment', 'activity_level']
        .includes(step.field as string)
      );
    
    case 'performance':
      const performanceStep = allSteps.find(step => step.field === 'exercise_performance');
      if (!performanceStep || !exercise) return [];
      return [{
        ...performanceStep,
        title: `Log Performance - ${exercise}`,
        description: 'Enter your performance details for this exercise'
      }];
  }
};